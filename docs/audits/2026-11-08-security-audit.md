# Security & abuse audit — five products (pass 2: past the known blockers)

*F2 fleet audit, 2026-11-08 · Method: read every server/client surface, then probed live servers (03 on :4273, 01 on :4173, 02's guard in a real browser via a Playwright harness). Every finding reproduced, not inferred. Known blockers (01 dup rows, 02 URL paywall, 03 unauth moderation + dead permalinks, 04 free unlock, 00 share card) marked **[known]** where hit, not re-reported. Folded into the issues catalog §11.*

---

## Findings

### 03-grademyfit

**1. [L] Persona takeover: `POST /api/persona` mints a valid token for any known persona id**
`identity.ts:72-85` — `ensurePersona` returns the existing row when `personaId` is already registered, and `index.ts:61-75` then calls `issueToken(persona.id)` unconditionally. Identity = a client-chosen string; possession of the string is treated as ownership. Seed persona ids are hardcoded in the repo (`seed.ts:21-36`), so this works instantly against seed accounts.

Repro (live):
```
POST /api/persona {"personaId":"s0000000-0000-4000-8000-000000000001","handle":"attacker-was-here"}
→ 200 {"token":"eyJwaWQiOiJzMDAw...", "persona":{"id":"s0000000-...-0001","handle":"moss-archivist",...}}
POST /api/vote (with that token) on the persona's own post → {"error":"SELF_VOTE"}  ← proves full identity
```
The hijacker can vote, post, report, spend the victim's credits, and re-set their notification email (`/api/notify`). Tokens never expire (`issueToken` has no `exp`, `identity.ts:43-46`), so takeover is permanent.

Fix sketch: require proof-of-possession for an existing persona (registration returns a recovery secret; re-claim requires it), or bind tokens to a server-generated secret issued only at creation. Add `exp`/rotation.

**2. [L] The "stolen token alone is inert" claim is false — `/api/challenge` issues nonces to any token holder**
`identity.ts:1-5` documents the nonce as making a stolen token inert, but `index.ts:77-80` verifies only the token before `issueNonce`. Proven: nonce issued purely from the hijacked token; every documented invariant ("every mutating call must also spend a single-use nonce") is also violated by `/api/persona` and `/api/notify` (no nonce consumed).
Fix sketch: nonces must be bound to something the token alone doesn't give you, or drop the claim and the mechanism.

**3. [L] All rate limits are keyed to freely-mintable identities — they are not rate limits**
`CHALLENGE_RATE_LIMIT=30` (`identity.ts:13`), `MAX_POSTS_PER_DAY=3` (`posting.ts:15`), `REPORT_HOURLY_CAP=10` (`moderation.ts:13`) all count **per persona**. Persona creation is unauthenticated and unlimited. Proven: four burner personas each posted (HTTP 200 ×4). Consequences at launch, all from one 10-line script: unlimited 5 MB uploads (disk-full DoS), 100 credits/day per persona farmed, unlimited reports from fresh personas to auto-hide any post in one minute.
Fix sketch: key cost limits on something with acquisition cost (IP/connection-level limits, proof-of-work, or payment), not on a client-generated UUID.

**4. [L] Unhandled `ReadStream` error: a single racing GET+remove crashes the whole server**
`index.ts:176-182` — `serveFile` stats synchronously, sends headers, then `createReadStream(path).pipe(res)` with **no `'error'` handler**. If the file is unlinked between the sync stat and the stream's async open (moderation `remove` does `unlinkSync`), the stream emits an unhandled `'error'` → uncaught exception → process exit.

Repro (live): loop post → 3 reports → remove while a second thread GETs the upload. **Server died on round 37** after 1,543 GETs:
```
Error: ENOENT: no such file or directory, open '.../uploads/mw6xxcw308263eef.png'
Emitted 'error' event on ReadStream instance ... Node.js v24.20.0   ← process exited
```
Remote DoS at launch; the only "auth" needed is a free persona. Even without the crash window, headers with `content-length` are sent before the open — mid-flight deletes also yield truncated 200s.
Fix sketch: `stream.on("error", () => res.destroy())`; open the fd first, then stat/stream from the fd; serialize delete-vs-serve per file.

**5. [M] Hidden/flagged posts remain fully readable via the permalink API — and still earn credits**
The feed filters `status != 'removed' AND hidden = 0` (`posts.ts:98`), but `GET /api/post/:id` only 404s on `removed` (`index.ts:87-91`), and `castVote` rejects only `removed` (`votes.ts:53`). Proven: post auto-hidden by 3 distinct reports → absent from feed, yet `GET /api/post/:id → 200`; a fresh persona voted on it and got `"creditsAwarded":5`.
Fix sketch: one visibility predicate used by every read path; no credit awards on non-public posts.

**6. [M] Review state machine has no preconditions: `dismiss` resurrects removed posts and blesses never-reported ones**
`moderation.ts:83-105`: `dismiss` sets `status='live', hidden=0` for **any** post id — including `status='removed'` and posts never flagged. Proven: remove → image deleted → dismiss → post back in the public feed with a dead image.
Fix sketch: `dismiss` requires `status='flagged'`; `remove` is terminal; validate transitions like you validate inputs.

**7. [M] Handles are not unique — feed impersonation**
`db.ts:18-23` has no UNIQUE on `personas.handle`; `ensurePersona` never checks it. Proven: second persona registered with a seed account's handle — both coexist; feed renders `by <handle>` with no distinguishing id.
Fix sketch: UNIQUE index + collision error; or render stable suffixes (`moss-archivist#3f2a`).

**8. [M] `POST /api/post` is not idempotent — a retry double-posts and double-charges 50 credits**
`createPost` (`posting.ts:91-130`) generates a fresh id every call and has no client idempotency key, while votes and reports are UNIQUE-guarded and 409 on replay. Any client retry after a network timeout re-executes the whole charge: a second `-50` ledger row. The UI's disabled-submit button does not survive retries.
Fix sketch: accept an optional client-generated idempotency key, stored UNIQUE; return the original result on replay.

**9. [m] Failed votes burn the single-use nonce (documented defense order weaponized against the user)**
`votes.ts:50` consumes the nonce before the post-exists/self-vote checks. Proven: vote on a nonexistent post → 404; the identical vote with the same nonce against a real post → 403 `REPLAYED_OR_STALE`. Combined with the 30-nonce/min cap, one client bug locks a persona out of mutating for up to a minute.
Fix sketch: consume the nonce last, inside the transaction that records the vote.

**10. [m] 500 responses leak raw error strings, reachable by anyone**
`index.ts:262` returns `{error:"INTERNAL", detail: msg}`. Proven: `GET /api/post/%E0%A4%A` → `{"error":"INTERNAL","detail":"URI malformed"}`.
Fix sketch: log the detail server-side; return only the generic code; map `URIError` → 400.

**11. [m] Unbounded growth: nonces, events, ledger, moderation.log, uploads have no TTL and `prune` only touches orphan images**
With finding 3, an attacker controls the fill rate of all of them. `orders.jsonl` in 01 has the same shape.
Fix sketch: nightly prune of consumed nonces and events past N days; log rotation; per-data-dir size cap alarm.

**Verified clean (03):** SQLi (all statements parameterized); ledger races — 2 concurrent paid posts with a 50-credit balance resolved to exactly one charge, and a 21-vote parallel burst capped awards exactly (single-threaded sync handlers make check-then-act atomic); prototype pollution; ReDoS; XSS in first-party clients (`textContent` everywhere — `<script>` payload renders inert); path traversal (all payload shapes 404); secret-key file mode 0600; body caps on all JSON routes (413 enforced).

---

### 01-swatchship

**12. [M] Request bodies are unbounded — memory-exhaustion DoS on `/api/checkout`**
`main.ts:40-46` — `readBody` accumulates chunks with **no size cap and no `req.destroy()`**. Proven: a 100 MB POST fully buffered and answered 400 in 0.1 s; nothing stops a 10 GB stream from being buffered in RAM (or a slowloris — no timeout either). Contrast: 03 bounds every body.
Fix sketch: cap bytes (the body is one SKU string — 64 KB is generous), `req.destroy()` on overflow, read timeout.

**13. [m] `success_url`/`cancel_url` built from the client-controlled `Host` header**
`main.ts:53` takes `origin = http://${req.headers.host}`; `handlers.ts:79-80` interpolates it into the Stripe session. Proven with a stub: `success_url sent to Stripe: http://evil.example:4173/?session_id=…`. A buyer completing payment is redirected to the attacker's origin, session_id and all. Needs the victim to hit the attacker's Host (DNS rebinding/proxy), so m — but the fix is one line.
Fix sketch: hardcode the origin from config; never derive redirect URLs from `Host`.

**[known, hit and confirmed]** `GET /api/order/confirm` appends an order row on every call with no dedupe — the client re-calls it on every load of the success URL, so a refresh duplicates the row. Not re-reported; noted that `handleConfirm` itself is otherwise the strongest code in the set (server-side re-retrieval from Stripe, fail-closed 402, `payment_status==='paid'` gate — verified no-key path fails closed with 503 live).

**Verified clean (01):** static path traversal (7 payload shapes; `normalize()` clamps at root); prices server-side from the SKU table (client sends only a key); no secrets in `dist/` (build-gate enforces the `sk_` grep); confirm fails closed without a Stripe key; generic 500 (no detail leak).

---

### 02-bodyarchetype

**14. [M] The privacy guarantee is enforced by intercepting exactly 4 JS APIs — three common exfil primitives walk past it**
`network-guard.ts:61-140` wraps `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon` only. Harness: verbatim copy of the guard transpiled with the project's own esbuild, installed in a real Chromium page, requests aimed at a local listener:
```
fetch  → refused ("network guard: refused fetch to …", counters.refused: 1)
Image().src      → HIT  /img-beacon?d=photo-data-url-snippet   ← left the page
CSS url()        → HIT  /css-beacon.gif                        ← left the page
EventSource      → HIT  /es-beacon                             ← left the page
```
The product's core promise ("your photo never leaves your device", enforced "even by accident") is one `new Image()` away from false. Any injected script, malicious npm dependency, or compromised CDN asset can beacon the photo in a GET query string.
Fix sketch: state the guarantee honestly ("analysis code is network-caged for fetch/XHR/WS/beacon"), or enforce for real — CSP `default-src 'self' <pinned origins>` delivered as a header plus `require-trusted-types-for 'script'`, which browsers enforce outside JS reach. (No CSP header exists on the served app today.)

**[known, hit and confirmed]** `?purchase=success` sets the unlock flag — the known URL-bypassable paywall; adjacent: the localStorage unlock flag from devtools has identical effect. Same class, not re-reported.

**Verified clean (02):** rendering uses `textContent`/`replaceChildren` throughout; the one `innerHTML` interpolates only numeric landmark floats from the on-device model; no `JSON.parse` of untrusted structured data; no secrets in `dist/`.

---

### 04-planmyskin

**15. [m] Stored scan records are parsed without schema validation and flow into `innerHTML` slots**
`store.ts:53-62` returns **any** JSON array from localStorage; `render.ts:52-57` interpolates scores into an SVG string via `innerHTML`. A tampered record (`scores.redness = "'><img src=x onerror=…>"`) executes. No cross-user vector exists today (records never leave the device; no share URL) — hardening — but it's the same slot pattern that becomes stored XSS the day a sync/share feature lands.
Fix sketch: validate records on read (finite numbers clamped 0–100, zones match known names) or render with `setAttribute`/`textContent`.

**[known, hit and confirmed]** The unlock button literally calls `store.unlock()` — that is the known "paywall-takes-nothing"; the localStorage forge is the same class.

**Verified clean (04):** remedies render from a closed, static allowlist ("the generator reads ONLY these keys"); all report copy goes through `textContent`; no URL parameters read anywhere; share card is canvas → download (no network); no secrets in `dist/`.

---

### 00-finessetry

**16. [M] The license gate is a hardcoded string in the shipped bundle**
`main.ts:10` `const DEMO_CODE = 'FINESSETRY-FOUNDER'`; check at `main.ts:248-258`. Confirmed present in the minified single-file bundle: `dist/index.html` contains `const me="FINESSETRY-FOUNDER"`. View-source → full report, permanently (the localStorage unlock flag also works). The page is honest that checkout isn't wired, but the copy does not disclose that the gate itself is extractable in seconds — for anything resembling a launch, the paid surface is free.
Fix sketch: any real gate needs a server (even a static-hosted function) that validates the code and returns a short-lived signed entitlement; a client-only check can only ever be a speed bump.

**Verified clean (00):** every user-visible string renders via `textContent`; the two `innerHTML` uses are cleared containers and static copy; verdict JSON.parse is unvalidated but every consumed field lands in text-only sinks; the hex regexes are linear; the app makes zero network requests, so there is nothing to exfiltrate with; camera is local `getUserMedia`.

---

## Cross-product summary

**Recurring trust assumptions — the same four mistakes in five different costumes:**

1. **"Client-held state is the entitlement"** — 00's license code, 02's URL/localStorage flag, 04's unlock flag and free-unlock button, 03's claimable persona ids. Four of five products decide *who has paid / who you are* inside the attacker-controlled runtime.
2. **"A client-generated identifier is an identity"** — 03's persona takeover and its dead rate limits: every per-persona cap is keyed to a string anyone can mint, so no limit exists. The nonce "second factor" protects nothing because it's issued to the same credential it protects.
3. **"Invariants implemented in page JS are guarantees"** — 02's network guard (proven bypass), 01's implicit trust in `Host`, 00's license check. Anything enforced below the DOM can be stepped around by the runtime it lives in.
4. **"The happy path defines the protocol"** — 01 buffers any body and redirects wherever `Host` says; 03's permalink read path bypasses the feed's visibility filter and its review state machine accepts transitions from any state; retries the UI prevents still hit the server un-idempotently.

**The one server-side standard that kills the whole class:**

> **Every state change and every entitlement grant happens on a server, bound to (a) an identity the *server* minted as a secret credential, (b) an idempotency key that makes retries inert, (c) a cost limit keyed to something with acquisition cost, and (d) one shared visibility predicate for every read path. Treat the client bundle as attacker literature: no secrets, no gates, no invariants live there.**

Concretely: 00/02/04 get a small entitlement function (payment event → signed, expiring grant; all reads check it server-side); 03 replaces persona-claim with server-issued credentials and routes every read through one `visibleTo(viewer)` filter; 01 caps its body, pins its origin, and dedupes on `(sessionId)` — which it already fetches from Stripe, so the key is sitting right there.

**Things that looked suspect and checked out clean** (worth knowing for pass 3): 03's ledger math under parallel load (exactly one 50-credit charge; exactly the daily cap), SQL injection everywhere (parameterized, all five products' queries read), prototype pollution (no JSON-parse-into-object merges), ReDoS (no attacker-controlled regex), secrets in any dist tree (01 even ships a build gate for it), path traversal on 01/03 static routes.

**Severity totals: 16 new findings beyond the known blockers — 4 L (exploitable at launch), 5 M, 7 m.**

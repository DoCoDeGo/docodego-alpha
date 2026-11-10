---
name: docodego-domain-scout
description: Batch-verifies .com domain availability via Verisign RDAP (404 = available), detects snipes via same-day re-verification, and generates brandable alternates. Use when naming products, asked to "check if domains are available", building a domain shortlist, or immediately before registering. Encodes this project's hard lessons — names were sniped within hours, Finesse® trademark collision forced a rebrand.
---

# docodego-domain-scout — verify live, never assume

Domain availability is time-sensitive. Availability claims without a live RDAP check
in this session are forbidden. Registration-day re-verification is part of the job.

## The check

```bash
curl -s -o /dev/null -w "%{http_code}" https://rdap.verisign.com/com/v1/domain/{name}.com
```

- `404` = available · `200` = registered · anything else = retry once, then report
  "unknown" — never guess.
- Batch in parallel (a loop over candidates is fine); report a table, not prose.

## Generating candidates

When asked to invent names, produce brandable ones:
- 6–13 letters, pronounceable, no hyphens/digits; compound or verb+noun shapes
  (wardrobeclimate, giftsleigh, leafrevival — all verified by this method).
- Say-it-once test: user hears it, types it right.
- Trademark pre-screen: flag exact matches to known consumer brands/classes (the
  project's "Finesse" collided with Lornamead's Finesse® — that cost the flagship its
  first choice). Advise a proper TM search before registration; RDAP ≠ trademark-safe.
- Offer 5 verified-available per product plus 2 spares — sniping happens.

## Workflow

1. Generate or receive candidates.
2. RDAP-batch all; table: name | code | verdict | checked-at timestamp.
3. Available set too small → generate another round, repeat.
4. Record results in the product's portfolio entry
   (`docs/products/product-portfolio.md`, Appendix A holds the current registry).
5. **Before purchase**: re-run the batch same-day; diff against the earlier table and
   call out every snipe loudly. This project observed 5 snipes within hours.

## Guardrails

- Never mark "available" from memory, cache, or a prior session — always live-check.
- Never advise parking long; decide and register, or release the name back to the pool.
- Checked-at dates go in the record; a check older than the session is stale.

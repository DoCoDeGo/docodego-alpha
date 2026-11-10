---
name: docodego-context-forge
description: Generates 10 permission-free passive-context enhancements for a product using the toolkit — edge-header geo, timezone/locale, Open-Meteo weather/AQI/pollen, hemisphere logic, holiday tables, water hardness, elevation, day-length — always including PPP pricing, a referrer-split variant, and auto lite-mode. Use when asked to "add context enhancements for product NN", "make the site feel local without asking", or after writing a base product prompt. Encodes docs/products/_passive-context.md and its ethics rules.
---

# docodego-context-forge — context without permission

Read `docs/products/_passive-context.md` (the toolkit) and the
product's base prompt first. Write the output to
`docs/products/NN-name/context.md`.

## The 10 ideas — required composition

Exactly 10, each in this format:

```
N. **Idea name** — Signal: <passive signal>. Feature: <what the user experiences>.
   Build: <mechanism in one line>.
```

The set must include, at minimum:
1. **PPP pricing** — 3-tier from country tier; scale from the product's base price
   (portfolio defaults: $14.99 / $9.90 / $5.90 — scale proportionally, e.g. a $6.99
   product → $6.99 / $4.90 / $2.90).
2. **Referrer-split variant** — TikTok-style arrivals get story-format heroes;
   search arrivals get answer-first utility heroes.
3. **Auto lite-mode** — network (`effectiveType`) + battery gate; same results,
   deferred visuals, essential decisions readable in seconds.
4. At least one **weather/climate** idea (Open-Meteo: forecast, AQI, humidity,
   UV, or climate normals).
5. At least one **calendar idea** (holiday tables, hemisphere season flip, day-count
   to a local event, or ICS export for reminders — the account-free scheduling story).

Flesh the remaining five from the product's own subject — the context should change
what the product *says or recommends*, not just decorate it.

## Ethics (non-negotiable, from the toolkit)

- NEVER `navigator.geolocation`. NEVER store coordinates. Approximate signals only.
- City-level trait tables stay generic and respectful; cultural norms framing is
  opt-in, toggleable, never stereotyping individuals.
- No fake urgency — real dates only (ship-by, forecast-changes, RSVP deadlines).
- When confidence is low (cultural etiquette, health-adjacent notes), the honest
  line ships with the feature ("check with the couple", "a dermatologist can confirm").

## Quality bar

An idea is good if a user could feel it and never know a permission was avoided:
specific (names the dataset and the trigger), cheap (no new server state), and
honest (labels approximation as approximation — "climate normals" when the forecast
is too far out).

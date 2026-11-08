---
name: docodego-payments
description: Payment wiring that survives an audit. Use when a product gains checkout, subscriptions, one-time purchases, or paywall tiers - the launch-auditor's payment section as craft - provider-side verification of every price, webhook signature checks, tier entitlements tested with evidence, and PPP/regional pricing handled honestly.
version: 1.0.0
auto-add: true
---

# docodego-payments

Payment bugs do not fail loudly - they fail as "the customer paid and
got nothing" or "the customer got it and paid nothing." The craft comes
from the launch-auditor's payment wiring section: every price the server
re-derives, every entitlement the server enforces, every path proved
with a recorded transaction.

## The checks - each ends in recorded evidence

1. **No client-trusted prices.** The amount charged is computed or
   verified server-side from the provider's catalog - never accepted
   from the client. Evidence: the code path that re-derives the price.
2. **Webhooks verify signatures.** Every provider callback checks its
   signature before trusting it, and handles replay (timestamps, id
   de-duplication). Evidence: the forged-webhook test that gets refused.
3. **Entitlements are server-enforced.** The paywall is not a UI
   conditional; the gated resource checks the customer's actual state
   server-side. Evidence: the unentitled request that fails.
4. **The live path is tested end-to-end.** A recorded test transaction
   (provider test mode) per tier: purchase, entitlement granted,
   refund/cancel path exercised. The proofs name the transactions.
5. **Regional pricing, honestly.** PPP or regional tiers apply by
   verified eligibility, and the copy claims exactly what the mechanism
   enforces - the privacy/claims law applies to prices too.

## The refusal

A payment path that cannot produce its evidence is not shipped half-
checked: the unit stays undelivered and the tracker records what proof
is missing.

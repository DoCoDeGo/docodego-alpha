# 01 swatchship — physical swatch cards (software side)

**Domain:** swatchship.com · **Price anchor:** $39–49 + shipping

## Brief (verbatim)

"swatchship.com sells a physical thing: a person's own color palette as a lacquered swatch card set — a fan of 12–24 cards you carry shopping and hold up to garments under store light, so you stop buying the wrong shades. $39–49 plus shipping, ordered without an account. Many buyers will arrive from my color-analysis product's report carrying their season with them; others arrive cold and need a way to find their season on the page itself. Until production exists, the page may render the product beautifully — labeled as renders, never fake photos."

## Hard lines

- Any quiz that assigns a season must be deterministic — same answers, same season — and proven by tests.
- A season carried in from the flagship report (URL param or equivalent) must be validated: tampered or forged values fall back safely to the quiz, never to a wrong order.
- Checkout wiring is real in test mode (Stripe test mode or equivalent); no account creation anywhere — shipping address + email for order updates is the maximum identity.
- Honesty about the physical product: renders labeled as renders; shipping/returns copy never invents facts.

/**
 * The limited-time Pro offer. It matches two discounts on Polar, each preset on
 * the checkout link the website and the app use:
 *   - "Limited-time offer — first year" — Pro Annual, $35.99 off the first year
 *   - "Limited-time offer" — Pro Lifetime, $100.99 off
 * Both end at OFFER.endsAt, after which Polar ignores the preset discount, so
 * the page must stop showing the offer at the same moment. The page checks the
 * date at build time AND in the browser (see the script in index.astro).
 */
export const OFFER = {
  /** 2026-12-31 end of day, Hong Kong time — same instant as the Polar `ends_at`. */
  endsAt: '2026-12-31T16:00:00Z',
  endsLabel: 'Dec 31, 2026',
  annual: { regular: '59.99', offer: '24' },
  lifetime: { regular: '199.99', offer: '99' },
} as const;

/** True while the offer is running. */
export function isOfferActive(now: number = Date.now()): boolean {
  return now < Date.parse(OFFER.endsAt);
}

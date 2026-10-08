import { describe, expect, it } from 'vitest';
import { OFFER, isOfferActive } from '../offer';

describe('isOfferActive', () => {
  it('is active before the end', () => {
    expect(isOfferActive(Date.parse('2026-10-08T00:00:00Z'))).toBe(true);
  });

  it('is still active on the last day in Hong Kong', () => {
    // 23:59 on Dec 31 in Hong Kong is 15:59 UTC.
    expect(isOfferActive(Date.parse('2026-12-31T15:59:00Z'))).toBe(true);
  });

  it('ends at midnight Hong Kong time, the same instant as the Polar discounts', () => {
    expect(isOfferActive(Date.parse(OFFER.endsAt))).toBe(false);
    expect(isOfferActive(Date.parse('2027-01-01T00:00:00Z'))).toBe(false);
  });

  it('keeps the end date parseable', () => {
    expect(Number.isNaN(Date.parse(OFFER.endsAt))).toBe(false);
  });
});

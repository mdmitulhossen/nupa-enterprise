/**
 * Returns the discounted price if offer > 0, otherwise the original price.
 */
export const getDiscountedPrice = (price: number, offer?: number | null): number => {
  if (!offer || offer <= 0) return price;
  return Math.round(price * (1 - offer / 100));
};

/**
 * Formats a price as BDT string.
 */
export const formatBDT = (price: number): string => `BDT ${price.toLocaleString()}`;

/**
 * Returns true only if offer is a valid positive number.
 */
export const hasValidOffer = (offer?: number | null): offer is number =>
  typeof offer === "number" && offer > 0;
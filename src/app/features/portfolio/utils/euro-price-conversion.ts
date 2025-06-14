export function convertToEuroPrice(
  price: number,
  currencies: Record<string, number>,
  currency: string
): number {
  let normalizedPrice = price;
  let normalizedCurrency = currency.toUpperCase();

  // Special case: GBp (British pence) → divide by 100 to convert to GBP
  if (currency === "GBp" || currency === "gbp") {
    normalizedPrice = price / 100;
    normalizedCurrency = "GBP";
  }

  if (normalizedCurrency === "EUR") {
    return normalizedPrice;
  }

  const conversionRate = currencies[normalizedCurrency];
  if (!conversionRate) {
    console.error(currencies);
    throw new Error(`Conversion rate for ${currency} not found`);
  }

  return normalizedPrice / conversionRate;
}

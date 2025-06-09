// utils/isinUtils.ts

/**
 * Extracts all ISINs from a given string.
 * ISIN format: 2 letters (country code) + 9 alphanumeric characters + 1 check digit
 * Example: US0378331005
 *
 * @param text - The input string to search for ISINs
 * @returns An array of matched ISIN strings
 */
export function extractISINs(text: string): string[] {
  const isinRegex = /\b[A-Z]{2}[A-Z0-9]{9}[0-9]\b/g;
  const matches = text.match(isinRegex);
  return matches ?? [];
}

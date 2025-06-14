export function extractISINs(text: string): string[] {
  const isinRegex = /\b[A-Z]{2}[A-Z0-9]{9}[0-9]\b/g;
  const matches = text.match(isinRegex);
  return matches ?? [];
}

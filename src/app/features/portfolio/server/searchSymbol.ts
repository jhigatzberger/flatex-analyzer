import yahooFinance from "yahoo-finance2";
import { QuoteSearchSchema } from "../types/yahoo-finance-schemas";

export async function searchSymbol(isin: string) {
  const searchResult = await yahooFinance.search(isin);
  const match = searchResult.quotes?.[0];

  const parsed = QuoteSearchSchema.safeParse(match);
  if (!parsed.success) {
    console.error("Failed to parse search result", parsed.error);
    throw new Error("No valid quote found for ISIN");
  }

  return parsed.data.symbol;
}

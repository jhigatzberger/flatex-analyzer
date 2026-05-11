import { QuoteSearchSchema } from "../types/yahoo-finance-schemas";
import { hardCodedIsinRemap } from "../utils/remove-known-symbol-wrappers";
import { yahooFinance } from "./yahoo-finance";

export async function searchSymbol(isin: string) {
  isin = hardCodedIsinRemap(isin);
  const searchResult = await yahooFinance.search(isin, {
    region: "US",
  });
  console.log("Search result for ISIN:", isin, searchResult);
  const match = searchResult.quotes?.[0];

  const parsed = QuoteSearchSchema.safeParse(match);
  if (!parsed.success) {
    console.error("Failed to parse search result", parsed.error);
    throw new Error("No valid quote found for ISIN");
  }

  return parsed.data.symbol;
}

import { QuoteSearchSchema } from "../types/yahoo-finance-schemas";
import { hardCodedIsinRemap } from "../utils/remove-known-symbol-wrappers";
import { yahooFinance } from "./yahoo-finance";

export async function searchSymbol(isin: string) {
  isin = hardCodedIsinRemap(isin);

  let searchResult: any;
  try {
    searchResult = await yahooFinance.search(isin, { region: "US" });
  } catch (e: any) {
    if (e?.result) {
      searchResult = e.result;
    } else {
      throw e;
    }
  }

  const match = searchResult.quotes?.[0];
  const parsed = QuoteSearchSchema.safeParse(match);
  if (!parsed.success) {
    throw new Error("No valid quote found for ISIN");
  }

  return parsed.data.symbol;
}

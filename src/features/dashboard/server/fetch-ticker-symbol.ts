import { FullTickerData } from "../types/yahoo-finance-schemas";
import { yahooFinance } from "./yahoo-finance";

export async function fetchTickerData(ticker: string): Promise<FullTickerData> {
  const result = await yahooFinance.quoteSummary(ticker, {
    modules: ["price", "summaryDetail", "assetProfile", "financialData", "defaultKeyStatistics"],
  });
  return {
    ...result.defaultKeyStatistics,
    ...result.summaryDetail,
    ...result.assetProfile,
    ...result.financialData,
    ...result.price,
  } as unknown as FullTickerData;
}

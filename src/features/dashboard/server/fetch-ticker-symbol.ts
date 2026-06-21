import { FullTickerData } from "../types/yahoo-finance-schemas";
import { yahooFinance } from "./yahoo-finance";

export async function fetchTickerData(ticker: string): Promise<FullTickerData> {
  let result: any;
  try {
    result = await yahooFinance.quoteSummary(ticker, {
      modules: ["price", "summaryDetail", "assetProfile", "financialData", "defaultKeyStatistics"],
    });
  } catch (e: any) {
    if (e?.result) {
      result = e.result;
    } else {
      throw e;
    }
  }
  return {
    ...result.defaultKeyStatistics,
    ...result.summaryDetail,
    ...result.assetProfile,
    ...result.financialData,
    ...result.price,
  } as unknown as FullTickerData;
}

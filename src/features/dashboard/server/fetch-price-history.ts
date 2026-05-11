import { PriceHistoryResponse } from "../types/price-history";
import { yahooFinance } from "./yahoo-finance";

export async function fetchPriceHistory(
  tickers: string[],
  start: string,
  end: string
): Promise<PriceHistoryResponse> {
  if (!tickers.length || !start || !end) {
    throw new Error("Missing parameters");
  }

  const settled = await Promise.allSettled(
    tickers.map((t) => yahooFinance.historical(t, { period1: start, period2: end }))
  );

  const dateSet = new Set<string>();
  const prices: Record<string, (number | null)[]> = {};

  settled.forEach((result, i) => {
    if (result.status === "rejected") {
      console.warn(`fetchPriceHistory: skipping ${tickers[i]}:`, result.reason);
      return;
    }
    result.value.forEach((row) => dateSet.add(row.date.toISOString().split("T")[0]));
  });

  const dates = Array.from(dateSet).sort();

  settled.forEach((result, i) => {
    if (result.status === "rejected") return;
    const map = new Map(
      result.value.map((r) => [r.date.toISOString().split("T")[0], r.close])
    );
    prices[tickers[i]] = dates.map((d) => map.get(d) ?? null);
  });

  return { dates, prices };
}

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

  const results = await Promise.all(
    tickers.map((t) => yahooFinance.historical(t, { period1: start, period2: end }))
  );

  const dateSet = new Set<string>();
  results.forEach((r) =>
    r.forEach((row) => dateSet.add(row.date.toISOString().split("T")[0]))
  );
  const dates = Array.from(dateSet).sort();

  const prices: Record<string, (number | null)[]> = {};
  tickers.forEach((ticker, i) => {
    const map = new Map(
      results[i].map((r) => [r.date.toISOString().split("T")[0], r.close])
    );
    prices[ticker] = dates.map((d) => map.get(d) ?? null);
  });

  return { dates, prices };
}

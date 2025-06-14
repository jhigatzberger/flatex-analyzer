import { getEnv } from "@/lib/env";
import { PriceHistoryResponse } from "../types/price-history";

export async function fetchPriceHistory(
  tickers: string[],
  start: string,
  end: string
): Promise<PriceHistoryResponse> {
  const baseUrl = getEnv().YAHOO_FINANCE_WRAPPER_URL;

  if (!baseUrl) {
    throw new Error(
      "Server misconfiguration: missing YAHOO_FINANCE_WRAPPER_URL"
    );
  }

  if (!tickers.length || !start || !end) {
    throw new Error("Missing parameters");
  }

  const url = new URL("stocks/close_prices_range", baseUrl);
  tickers.forEach((ticker) => url.searchParams.append("ticker", ticker));
  url.searchParams.set("start", start);
  url.searchParams.set("end", end);

  const res = await fetch(url.toString(), { method: "GET" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Failed to fetch price history: ${data.error || "Unknown error"}`
    );
  }
  return data;
}

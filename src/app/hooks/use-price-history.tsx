import { useQuery } from "@tanstack/react-query";

type PriceHistoryResponse = {
  dates: string[];
  prices: Record<string, number[]>;
};

type UsePriceHistoryParams = {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  tickers: string[];
};

export function usePriceHistory({
  start,
  end,
  tickers,
}: UsePriceHistoryParams) {
  return useQuery<PriceHistoryResponse, Error>({
    queryKey: ["priceHistory", { start, end, tickers }],
    queryFn: async () => {
      const params = new URLSearchParams();
      tickers.forEach((ticker) => params.append("ticker", ticker));
      params.set("start", start);
      params.set("end", end);

      const res = await fetch(`/api/price-history?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch price history");
      }

      return res.json();
    },
    enabled: tickers.length > 0 && !!start && !!end, // only run if all inputs are valid
  });
}

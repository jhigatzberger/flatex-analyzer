import { useQuery } from "@tanstack/react-query";
import { PriceHistoryResponse, UsePriceHistoryParams } from "../types/price-history";


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

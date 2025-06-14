import { useQueries, useQuery } from "@tanstack/react-query";
import { FullTickerData } from "../types/yahoo-finance-schemas";

async function fetchTickerData(isin: string): Promise<FullTickerData | null> {
  try {
    const res = await fetch(
      `/api/isin-search?isin=${encodeURIComponent(isin)}`
    );
    if (!res.ok) {
      console.error("Fetch failed", await res.text());
      return null;
    }

    const data = await res.json();

    if (!data.tickerData) {
      console.error("Incomplete financial data for ISIN", isin);
      return null;
    }

    return data.tickerData as FullTickerData;
  } catch (err) {
    console.error("Fetch error", err);
    return null;
  }
}

export function useTickerData(isin: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ticker", isin],
    queryFn: async (): Promise<FullTickerData | null> => {
      const tickerData = await fetchTickerData(isin);
      return tickerData;
    },
    staleTime: Infinity,
  });

  return {
    data,
    isLoading,
    error,
  };
}

export function useTickerDatas(isins: string[]) {
  const { data, progress } = useQueries({
    queries: isins.map((isin) => ({
      queryKey: ["ticker", isin],
      queryFn: async (): Promise<{
        isin: string;
        tickerData: FullTickerData;
      }> => {
        const tickerData = await fetchTickerData(isin);
        return { isin, tickerData };
      },
      staleTime: 24 * 60 * 60 * 1000, // cache for 24h
    })),
    combine: (results) => {
      return {
        data: results
          .filter((r) => r.status === "success")
          .filter((r) => r.data.tickerData)
          .map((result) => result.data),
        progress:
          results.filter((result) => result.status === "success").length /
          results.length,
      };
    },
  });

  return {
    data,
    progress,
  };
}

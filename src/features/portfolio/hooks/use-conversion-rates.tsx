import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

type DailyRates = Record<string, number>;

interface ExchangeRateTimeSeries {
  base: string;
  start_date: string;
  end_date: string;
  rates: Record<string, DailyRates>;
}

async function fetchConversionRates(
  start: string,
  end: string
): Promise<ExchangeRateTimeSeries> {
  const params = new URLSearchParams({ start, end }).toString();
  const res = await fetch(`/api/exchange?${params}`);

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const data = await res.json();
  return data as ExchangeRateTimeSeries;
}

export function useConversionRates(start: string, end: string) {
  const { data, isLoading, isError, error } = useQuery<
    ExchangeRateTimeSeries,
    Error
  >({
    queryKey: ["exchange-rates", start, end],
    queryFn: () => fetchConversionRates(start, end),
    staleTime: 24 * 60 * 60 * 1000, // cache for 24h
    enabled: Boolean(start && end), // only run if both dates are provided
  });

  const ratesMap = useMemo(() => {
    const map = new Map<string, DailyRates>();
    if (data?.rates) {
      for (const date in data.rates) {
        map.set(date, data.rates[date]);
      }
    }
    return map;
  }, [data]);

  return {
    data,
    ratesMap,
    isLoading,
    isError,
    error,
  };
}

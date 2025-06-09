import { useQuery } from "@tanstack/react-query";

async function fetchConversionRates(): Promise<Record<string, number>> {
  const res = await fetch("/api/exchange");
  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  const data = await res.json();
  return data.conversion_rates;
}

export function useConversionRates() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["exchange-rates"],
    queryFn: fetchConversionRates,
    staleTime: 24 * 60 * 60 * 1000, // cache for 24h
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
}

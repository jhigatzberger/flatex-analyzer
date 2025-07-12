import { expose } from "comlink";
import dayjs from "dayjs";
import {
  calculatePortfolioIndex,
  DateValue,
} from "@/features/dashboard/logic/analyze";

// Use same logic as in your component, but in the worker:
function getNormalizedDateValues(values: DateValue[]): DateValue[] {
  if (values.length === 0) return [];
  const base = values[0].value;
  return values.map((entry, index) => ({
    date: entry.date,
    value: index === 0 || base === 0 ? 0 : (entry.value - base) / base,
  }));
}

function toApexSeriesData(arr: DateValue[]): [number, number | null][] {
  return arr.map((d) => [d.date.getTime(), d.value] as [number, number | null]);
}

// This is the function exposed to the main thread:
export async function prepareChartData({
  accumulatedNetWorth,
  accountCashFlows,
  priceData,
  tickers,
  timeframe,
}: {
  accumulatedNetWorth: DateValue[];
  accountCashFlows: DateValue[];
  priceData: {
    dates: string[];
    prices: Record<string, (number | null)[]>;
  } | null;
  tickers: { name: string; ticker: string }[];
  timeframe: 1 | 3 | 5 | "all";
}) {
  // Portfolio
  function timeframeToDate(timeframe: 1 | 3 | 5 | "all"): Date | undefined {
    if (timeframe === "all") return undefined;
    return dayjs().subtract(timeframe, "year").toDate();
  }

  const tfDate = timeframeToDate(timeframe);
  const portfolioIndex = calculatePortfolioIndex(
    accumulatedNetWorth,
    accountCashFlows,
    tfDate,
    new Date()
  );
  const networthSeries = toApexSeriesData(
    portfolioIndex.map((i) => ({
      date: i.date,
      value: i.index - 1,
    }))
  );

  // Benchmarks
  const benchmarkSeries =
    !priceData?.dates || !priceData.prices
      ? []
      : tickers.map(({ name, ticker }) => {
          const priceValues: DateValue[] = priceData.dates
            .map((dateStr, idx) => ({
              date: new Date(dateStr),
              value: priceData.prices[ticker]?.[idx] ?? null,
            }))
            .filter(
              (d) => timeframe === "all" || !tfDate || d.date >= tfDate
            )
            .filter((d) => d.value !== null) as DateValue[];

          return {
            name,
            data: toApexSeriesData(getNormalizedDateValues(priceValues)),
          };
        });

  return { networthSeries, benchmarkSeries };
}

expose({ prepareChartData });

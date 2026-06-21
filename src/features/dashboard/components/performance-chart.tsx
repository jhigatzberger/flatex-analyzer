"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Box, ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";
import { green, blue, red, cyan, orange, purple } from "@mui/material/colors";

import { useDepot } from "@/features/dashboard/hooks/use-depot";
import { ProgressState } from "@/features/dashboard/hooks/use-assets-calc";
import {
  getAccumulatedDepotValue,
  getAccumulatedCashPosition,
  getCombinedNetWorth,
  DateValue,
  getAccountCashFlows,
  calculatePortfolioIndex,
  simulatePortfolioValueGeneric,
  getAccumulatedCashFlows,
} from "@/features/dashboard/logic/analyze";
import { usePriceHistory } from "@/features/dashboard/hooks/use-price-history";
import { ISO_FORMAT } from "@/features/dashboard/utils/date-parse";
import { isInOutGoingTransaction } from "../utils/transaction-filter";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Define external tickers to include
const tickers = [
  { name: "S&P 500", ticker: "^GSPC" },
  { name: "NASDAQ", ticker: "NDX" },
  { name: "MSCI World", ticker: "EUNL.DE" },
];

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

function timeframeToDate(timeframe: 1 | 3 | 5 | "all"): Date {
  if (timeframe === "all") return undefined;
  return dayjs().subtract(timeframe, "year").toDate();
}

export default function PerformanceChart() {
  const { assets, accountTransactions, progress } = useDepot();
  const theme = useTheme();

  const firstTransactionDate = accountTransactions[0]?.Buchtag;

  const { data: priceData, isLoading } = usePriceHistory({
    start: firstTransactionDate
      ? dayjs(firstTransactionDate).format(ISO_FORMAT)
      : dayjs().format(ISO_FORMAT),
    end: dayjs().format(ISO_FORMAT),
    // Skip external benchmark fetch until we have actual user data to compare against
    tickers: firstTransactionDate ? tickers.map((t) => t.ticker) : [],
  });
  const accountCashFlows = getAccountCashFlows(accountTransactions, 1);
  const [timeframe, setTimeframe] = useState<1 | 3 | 5 | "all">(1);

  const handleTimeframeChange = (
    event: React.MouseEvent<HTMLElement>,
    newValue: 1 | 3 | 5 | "all" | null
  ) => {
    if (newValue !== null) setTimeframe(newValue);
  };

  const accumulatedDepotValue =
    progress.state === ProgressState.COMPLETED && firstTransactionDate
      ? getAccumulatedDepotValue(assets, firstTransactionDate, new Date())
      : [];

  const accumulatedCashPosition =
    getAccumulatedCashPosition(accountTransactions);

  const accumulatedNetWorth: DateValue[] =
    progress.state === ProgressState.COMPLETED
      ? getCombinedNetWorth(accumulatedCashPosition, accumulatedDepotValue)
      : [];

  const cashFlows = getAccumulatedCashFlows(accountTransactions);

  const networthSeries = useMemo(() => {
    /*const portfolioIndex = calculatePortfolioIndex(
      accumulatedNetWorth,
      accountCashFlows,
      timeframeToDate(timeframe),
      new Date()
    );
    return toApexSeriesData(
      portfolioIndex.map((i) => {
        return {
          date: i.date,
          value: i.index - 1,
        };
      })
    );*/
    return toApexSeriesData(
      accumulatedNetWorth.filter(
        (d) => timeframe === "all" || d.date >= timeframeToDate(timeframe)
      )
    );
  }, [accumulatedNetWorth, accountCashFlows, timeframe]);

  const benchmarkSeries = useMemo(() => {
    if (!priceData?.dates || !priceData.prices) return [];

    return tickers.map(({ name, ticker }) => {
      const priceValues: DateValue[] = priceData.dates
        .map((dateStr, idx) => ({
          date: new Date(dateStr),
          value: priceData.prices[ticker]?.[idx] ?? null,
        }))
        .filter((d) => d.value !== null) as DateValue[];

      return {
        name,
        data: toApexSeriesData(
          simulatePortfolioValueGeneric(priceValues, accountCashFlows).filter(
            (d) => timeframe === "all" || d.date >= timeframeToDate(timeframe)
          )
        ),
      };
    });
  }, [priceData, isLoading, timeframe]);

  const options: ApexOptions = {
    chart: {
      id: "relative-performance-chart",
      background: "transparent",
      toolbar: {
        show: true,
        tools: {
          download: false,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: { enabled: false },
    },
    theme: {
      mode: theme.palette.mode as "light" | "dark",
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      labels: {
        formatter: (value: number) => value.toFixed(1) + " €",
      },
    },
    tooltip: {
      x: { format: "dd MMM yyyy" },
      y: {
        formatter: (value: number) => value.toFixed(2) + " €",
      },
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    colors: [
      green[400],
      blue[400],
      red[400],
      cyan[400],
      orange[400],
      purple[400],
    ],
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 8 }}>
      <ToggleButtonGroup
        orientation="horizontal"
        value={timeframe}
        exclusive
        onChange={handleTimeframeChange}
        aria-label="timeframe selection"
        color="primary"
        sx={{ mt: 2, mb: 4 }}
        size="small"
      >
        <ToggleButton value={1}>1Y</ToggleButton>
        <ToggleButton value={3}>3Y</ToggleButton>
        <ToggleButton value={5}>5Y</ToggleButton>
        <ToggleButton value="all">All</ToggleButton>
      </ToggleButtonGroup>
      <Chart
        options={options}
        series={[
          { name: "Your Performance", data: networthSeries },
          {
            name: "Investment",
            data: toApexSeriesData(
              cashFlows.filter(
                (d) =>
                  timeframe === "all" || d.date >= timeframeToDate(timeframe)
              )
            ),
          },
          ...benchmarkSeries,
        ]}
        type="area"
        height={350}
        width="100%"
      />
    </Box>
  );
}

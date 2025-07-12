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
} from "@/features/dashboard/logic/analyze";
import { usePriceHistory } from "@/features/dashboard/hooks/use-price-history";
import { ISO_FORMAT } from "@/features/dashboard/utils/date-parse";
import { usePerformanceChartWorker } from "@/features/dashboard/hooks/use-performance-chart-worker";

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

export default function PerformancePage() {
  const { assets, accountTransactions, progress } = useDepot();
  const theme = useTheme();

  const firstTransactionDate = accountTransactions[0]?.Buchtag;

  const { data: priceData, isLoading } = usePriceHistory({
    start: dayjs(firstTransactionDate).format(ISO_FORMAT),
    end: dayjs().format(ISO_FORMAT),
    tickers: tickers.map((t) => t.ticker),
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
    progress.state === ProgressState.COMPLETED
      ? getAccumulatedDepotValue(assets, firstTransactionDate, new Date())
      : [];

  const accumulatedCashPosition =
    getAccumulatedCashPosition(accountTransactions);

  const accumulatedNetWorth: DateValue[] =
    progress.state === ProgressState.COMPLETED
      ? getCombinedNetWorth(accumulatedCashPosition, accumulatedDepotValue)
      : [];

  const { networthSeries, benchmarkSeries, loading } =
    usePerformanceChartWorker({
      accumulatedNetWorth,
      accountCashFlows,
      priceData,
      tickers,
      timeframe,
    });

  const options: ApexOptions = {
    chart: {
      id: "relative-performance-chart",
      background: "transparent",
      toolbar: { show: true },
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
        formatter: (value: number) => (value * 100).toFixed(1) + "%",
      },
    },
    tooltip: {
      x: { format: "dd MMM yyyy" },
      y: {
        formatter: (value: number) => (value * 100).toFixed(2) + "%",
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

  if(loading || isLoading) {
    return (
      <Box sx={{ width: "100%", height: "100%", p: 8 }}>
        <div>Loading...</div>
      </Box>
    );
  }

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
          ...benchmarkSeries,
        ]}
        type="area"
        height={350}
        width="100%"
      />
    </Box>
  );
}

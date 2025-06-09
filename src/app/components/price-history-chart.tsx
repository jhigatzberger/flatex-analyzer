"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { Typography, Box } from "@mui/material";
import { blue, orange, yellow } from "@mui/material/colors";

type PricePoint = {
  date: string;
  price: number;
};

type KeyEvent = {
  date: Date;
  price?: number;
  type: string;
};

type Props = {
  priceHistory: PricePoint[];
  keyEvents?: KeyEvent[];
  title?: string;
  colors?: Colors;
};

interface Colors {
  [key: string]: string;
}

export default function PriceHistoryChart({
  priceHistory,
  keyEvents = [],
  colors,
}: Props) {
  if (!priceHistory.length) {
    return <Typography>No price history available</Typography>;
  }

  const dates = priceHistory.map((p) => new Date(p.date));
  const prices = priceHistory.map((p) => (p.price === 0 ? null : p.price));

  // Get unique event types dynamically
  const uniqueEventTypes = Array.from(new Set(keyEvents.map((e) => e.type)));

  // Create a map of date strings to index for fast lookup
  const dateIndexMap = new Map(
    dates.map((d, i) => [d.toISOString().split("T")[0], i])
  );

  // Build aligned data series for each event type
  const eventSeries = uniqueEventTypes.map((type) => {
    const data = Array(dates.length).fill(null);

    keyEvents
      .filter((e) => e.type === type)
      .forEach((e) => {
        const isoDate = e.date.toISOString().split("T")[0];
        const index = dateIndexMap.get(isoDate);
        if (index !== undefined) {
          data[index] = e.price ? e.price : prices[index]; // Use price if available, otherwise null
        }
      });

    return {
      label: type,
      data,
      showMark: true,
      color: colors?.[type] || "#ff9800", // Default color if not provided
    };
  });

  return (
    <LineChart
      height={350}
      width={550}
      xAxis={[{ scaleType: "time", data: dates }]}
      series={[
        {
          area: true,
          data: prices,
          label: "Price",
          showMark: false,
          color: orange[200],
          connectNulls: true,
        },
        ...eventSeries,
      ]}
    />
  );
}

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

  const uniqueEventTypes = Array.from(new Set(keyEvents.map((e) => e.type)));

  const dateIndexMap = new Map(
    dates.map((d, i) => [d.toISOString().split("T")[0], i])
  );

  const eventSeries = uniqueEventTypes.map((type) => {
    const data = Array(dates.length).fill(null);

    keyEvents
      .filter((e) => e.type === type)
      .forEach((e) => {
        const isoDate = e.date.toISOString().split("T")[0];
        const index = dateIndexMap.get(isoDate);
        if (index !== undefined) {
          data[index] = e.price ? e.price : prices[index];
        } else {
          // TODO: handle missing dates
          console.warn(`Date ${isoDate} not found in price history.`);
        }
      });

    return {
      label: type,
      data,
      showMark: true,
      color: colors?.[type] || "#ff9800",
    };
  });

  return (
    <LineChart
      sx={{ maxWidth: "100%", maxHeight: "100%", width: 600, height: 400 }}
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

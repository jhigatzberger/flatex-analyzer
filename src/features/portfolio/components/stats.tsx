"use client";

import {
  Typography,
  Grid,
  Box,
  LinearProgress,
  CardContent,
  Card,
  Paper,
} from "@mui/material";
import React from "react";
import { DepotItemCard } from "./depot-item-card";
import {
  getInitialInvestment,
  getCashPosition,
  getDepotSum,
  calculateXIRR,
  getAccumulatedCashFlows,
  getAccumulatedDepotValue,
  getAccumulatedCashPosition,
} from "../logic/analyze";
import { DepotChart } from "./depot-chart";
import { PieChartSwitcher } from "./pie-chart-switcher";
import { LineChart } from "@mui/x-charts";
import { useShowValues } from "../hooks/use-show-values";
import { ProgressState } from "../hooks/use-assets-calc";
import { useDepot } from "../hooks/use-depot";
import { ParsedAccountTransaction } from "../types/account-transaction";
import { Asset } from "../types/asset";

function PortfolioOverview({
  accountTransactions,
  sortedItems,
  progress,
}: {
  accountTransactions: ParsedAccountTransaction[];
  sortedItems: Asset[];
  progress: ProgressState;
}) {
  const { showValues } = useShowValues();
  const initialInvestment = getInitialInvestment(accountTransactions);
  const cashPosition = getCashPosition(accountTransactions);
  const depotSum = getDepotSum(sortedItems);
  const totalValue = cashPosition + depotSum;
  const firstTransactionDate = accountTransactions[0]?.Buchtag;

  const xirr = calculateXIRR(accountTransactions, sortedItems);

  const profit = totalValue - initialInvestment;

  const kpis = [
    {
      label: "Annual Performance",
      value: xirr !== 0 ? `${(xirr * 100).toFixed(2)}%` : "N/A",
    },
    {
      label: "Total Performance",
      value: `${(
        ((totalValue - initialInvestment) / initialInvestment) *
        100
      ).toFixed(2)}%`,
    },
  ];

  const cashFlows = getAccumulatedCashFlows(
    firstTransactionDate,
    new Date(),
    accountTransactions
  );

  const accumulatedDepotValue =
    progress === ProgressState.COMPLETED
      ? getAccumulatedDepotValue(sortedItems, firstTransactionDate, new Date())
      : [];

  const accumulatedCashPosition = getAccumulatedCashPosition(
    firstTransactionDate,
    new Date(),
    accountTransactions
  );

  const accumulatedNetworth =
    progress === ProgressState.COMPLETED
      ? accumulatedDepotValue.map((d, index) => ({
          date: d.date,
          value: d.value + accumulatedCashPosition[index].value,
        }))
      : [];

  return (
    <Box sx={{ p: 2 }} maxWidth="xl" width={"100%"}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 8, lg: 6 }}>
          <Paper sx={{ p: 2, mb: 2, height: "calc(100% - 16px)" }}>
            <LineChart
              yAxis={[
                {
                  valueFormatter: (value) => (showValues ? value : ""),
                },
              ]}
              sx={{
                height: "100%",
              }}
              xAxis={[
                {
                  data: cashFlows.map((d) => d.date),
                  scaleType: "time",
                  label: "Date",
                },
              ]}
              series={[
                {
                  data: cashFlows.map((d) => d.value),
                  label: "Invested (€)",
                  showMark: false,
                },
                {
                  data: accumulatedNetworth.map((d) => d.value),
                  label: "Total Value (€)",
                  showMark: false,
                  connectNulls: true,
                  stack: "accumulatedDepotValue",
                },
              ]}
            />
          </Paper>
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ mb: 2 }}
          size={{ xs: 12, md: 4, lg: 1.5 }}
        >
          {kpis.map((kpi) => (
            <Grid size={{ xs: 6, sm: 6, md: 12 }} key={kpi.label}>
              <Card sx={{ height: "100%" }}>
                <CardContent
                  sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography variant="subtitle2" color="text.secondary">
                    {kpi.label}
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {kpi.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.25 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <DepotChart depotItems={sortedItems} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 2.25 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <PieChartSwitcher
              dataSets={[
                {
                  key: "profit",
                  label: "Profit",
                  data: [
                    {
                      label: "Profit",
                      value: profit,
                      id: "profit",
                    },
                    {
                      label: "Initial Investment",
                      value: initialInvestment,
                      id: "initialInvestment",
                    },
                  ],
                },
                {
                  key: "depot",
                  label: "Cash Position",
                  data: [
                    {
                      label: "Cash Position",
                      value: cashPosition,
                      id: "cashPosition",
                    },
                    {
                      label: "Depot Value",
                      value: depotSum,
                      id: "depotValue",
                    },
                  ],
                },
              ]}
            />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {sortedItems.map((item) => (
          <Grid key={item.isin} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <DepotItemCard item={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export function Stats() {
  const { assets, progress, accountTransactions } = useDepot();

  const sortedItems = [...assets].sort((a, b) => {
    const valueA = a.currentPositionValue || 0;
    const valueB = b.currentPositionValue || 0;
    return valueB - valueA;
  });

  return (
    <Box
      width={"100%"}
      display={"flex"}
      flexDirection="column"
      alignItems={"center"}
    >
      {progress.state !== ProgressState.COMPLETED && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              value={progress.progress * 100}
            />
          </Box>
          <Typography color="text.primary" variant="caption" gutterBottom>
            {progress.message}
          </Typography>
        </Box>
      )}

      <PortfolioOverview
        accountTransactions={accountTransactions}
        sortedItems={sortedItems}
        progress={progress.state}
      />
    </Box>
  );
}

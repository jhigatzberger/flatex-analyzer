"use client";

import {
  Typography,
  Grid,
  Box,
  CardContent,
  Card,
  Paper,
  Chip,
  useTheme,
} from "@mui/material";
import React from "react";
import {
  getInitialInvestment,
  getCashPosition,
  getDepotSum,
  calculateXIRR,
} from "../logic/analyze";
import { DepotChart } from "./depot-chart";
import { PieChartSwitcher } from "./pie-chart-switcher";
import { ProgressState } from "../hooks/use-assets-calc";
import { ParsedAccountTransaction } from "../types/account-transaction";
import { Asset } from "../types/asset";
import PerformanceChart from "./performance-chart";
import { useXirrWorker } from "../hooks/use-xirr-worker";

export function PortfolioOverview({
  accountTransactions,
  assets,
  progress,
}: {
  accountTransactions: ParsedAccountTransaction[];
  assets: Asset[];
  progress: ProgressState;
}) {
  const sortedItems = [...assets].sort((a, b) => {
    const valueA = a.currentPositionValue || 0;
    const valueB = b.currentPositionValue || 0;
    return valueB - valueA;
  });
  const initialInvestment = getInitialInvestment(accountTransactions);
  const cashPosition = getCashPosition(accountTransactions);
  const depotSum = getDepotSum(sortedItems);
  const totalValue = cashPosition + depotSum;

  const { xirr, loading: xirrLoading } = useXirrWorker(accountTransactions, sortedItems);

  const profit = totalValue - initialInvestment;

  const kpis = [
    {
      label: "Annual Performance",
      value: xirrLoading
        ? "Loading..."
        : xirr !== null
          ? `${(xirr * 100).toFixed(2)}%`
          : "N/A",
    },
    {
      label: "Total Return",
      value: `${(
        ((totalValue - initialInvestment) / initialInvestment) *
        100
      ).toFixed(2)}%`,
    },
  ];

  return (
    <Box sx={{ p: 2 }} width={"100%"}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
          <Box>
            <Paper sx={{ p: { lg: 4, xs: 2 }, height: "100%" }}>
              <PerformanceChart
                accountTransactions={accountTransactions}
                sortedItems={sortedItems}
                progress={progress}
              />
            </Paper>
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <DepotChart depotItems={sortedItems} />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }}>
          <Paper sx={{ p: 2, height: "100%" }}>
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
        <Grid container spacing={2} sx={{ mb: 2 }} size={{ xs: 12 }}>
          {kpis.map((kpi) => (
            <Grid size={{ xs: 6, sm: 6, md: 6 }} key={kpi.label}>
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
      </Grid>
    </Box>
  );
}

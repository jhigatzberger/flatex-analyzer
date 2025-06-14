import { useState } from "react";
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import ValueTypography from "./value-typography";
import { useShowValues } from "../hooks/use-show-values";

type PieData = {
  id: string;
  label: string;
  value: number;
};

type ChartDataSet = {
  key: string;
  label: string;
  data: PieData[];
};

type GenericPieChartSwitcherProps = {
  dataSets: ChartDataSet[];
};

export function PieChartSwitcher({ dataSets }: GenericPieChartSwitcherProps) {
  const { showValues } = useShowValues();
  const [selectedKey, setSelectedKey] = useState(dataSets[0]?.key || "");

  const selectedData = dataSets.find((d) => d.key === selectedKey);

  const totalValue = selectedData?.data.reduce((sum, item) => sum + item.value, 0) ?? 0;

  const handleMetricChange = (
    event: React.MouseEvent<HTMLElement>,
    newKey: string | null
  ) => {
    if (newKey) {
      setSelectedKey(newKey);
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {selectedData && selectedData.data.length > 0 && (
        <Box sx={{ position: "relative", width: 200, height: 200 }}>
          <PieChart
            series={[
              {
                data: selectedData.data.sort((a, b) => b.value - a.value),
                innerRadius: 60,
                outerRadius: 100,
                paddingAngle: 2,
                cornerRadius: 2,
                highlightScope: { fade: "global", highlight: "item" },
                faded: { additionalRadius: -10, color: "gray" },
                valueFormatter: (value) => {
                  return showValues ? value.value.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }) : ((value.value / totalValue) * 100).toFixed(2) + "%";
                },
              },
            ]}
            width={200}
            height={200}
            hideLegend
          />
          <ValueTypography
            variant="body1"
            align="center"
            fontWeight="bold"
            sx={{ position: "absolute", top: 90, left: 0, right: 0 }}
          >
            {totalValue.toLocaleString("de-DE", {
              style: "currency",
              currency: "EUR",
            })}
          </ValueTypography>
        </Box>
      )}

      <ToggleButtonGroup
        orientation="horizontal"
        value={selectedKey}
        exclusive
        onChange={handleMetricChange}
        aria-label="chart grouping metric"
        color="primary"
        sx={{ mt: 2, mb: 2 }}
        size="small"
      >
        {dataSets.map((set) => (
          <ToggleButton key={set.key} value={set.key} aria-label={set.label}>
            {set.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}

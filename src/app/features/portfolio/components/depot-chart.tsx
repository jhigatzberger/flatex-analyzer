import { Asset } from "../types/asset";
import { PieChartSwitcher } from "./pie-chart-switcher";

function getAssetPieData(items: Asset[]) {
  return items
    .filter((item) => item.currentPositionValue)
    .map((item) => ({
      id: item.isin,
      label: item.name,
      value: item.currentPositionValue!,
    }))
    .sort((a, b) => b.value - a.value);
}

function getSectorPieData(items: Asset[]) {
  const sectorMap: Record<string, number> = {};

  for (const item of items) {
    if (!item.currentPositionValue) continue;
    const isETF = item.tickerData?.quoteType === "ETF";
    const sector = isETF ? "ETF" : item.tickerData?.sector ?? "Missing Sector Data";
    sectorMap[sector] = (sectorMap[sector] ?? 0) + item.currentPositionValue;
  }

  return Object.entries(sectorMap)
    .map(([sector, value]) => ({
      id: sector,
      label: sector,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

function getCountryPieData(items: Asset[]) {
  const countryMap: Record<string, number> = {};

  for (const item of items) {
    if (!item.currentPositionValue) continue;
    const isETF = item.tickerData?.quoteType === "ETF";
    const country = isETF ? "ETF" : item.tickerData?.country ?? "Missing Country Data";
    countryMap[country] =
      (countryMap[country] ?? 0) + item.currentPositionValue;
  }

  return Object.entries(countryMap)
    .map(([country, value]) => ({
      id: country,
      label: country,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

export function DepotChart({ depotItems }: { depotItems: Asset[] }) {
  return (
    <PieChartSwitcher
      dataSets={[
        {
          key: "asset",
          label: "Assets",
          data: getAssetPieData(depotItems),
        },
        {
          key: "sector",
          label: "Sectors",
          data: getSectorPieData(depotItems),
        },
        {
          key: "country",
          label: "Countries",
          data: getCountryPieData(depotItems),
        },
      ]}
    />
  );
}

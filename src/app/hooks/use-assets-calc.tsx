import { FullTickerData } from "../../lib/finance/schemas";
import { getEuroPrice } from "../../lib/utils/currency";
import { Asset } from "../types/asset";
import { DepotItem } from "../types/depot-item";
import { useConversionRates } from "./use-conversion-rates";
import {
  DepotItemDetails,
  mergeDepotItemDetails,
  useDepotItemDetails,
} from "./use-depot-item-details";
import { usePriceHistory } from "./use-price-history";
import { useTickerDatas } from "./use-ticker-data";

function getProgressState(
  conversionRatesIsLoading: boolean,
  tickerDataProgress: number,
  priceHistoryIsLoading: boolean
): ProgressDetails {
  if (conversionRatesIsLoading) {
    return {
      state: ProgressState.FETCHING_CONVERSION_RATES,
      progress: 0,
      message: "Fetching conversion rates...",
    };
  }

  if (tickerDataProgress < 1) {
    return {
      state: ProgressState.FETCHING_TICKER_DATA,
      progress: Math.max(tickerDataProgress * 0.75, 0),
      message: "Fetching ticker data...",
    };
  }

  if (priceHistoryIsLoading) {
    return {
      state: ProgressState.FETCHING_PRICE_HISTORY,
      progress: 0.8,
      message: "Fetching price history...",
    };
  }

  return {
    state: ProgressState.COMPLETED,
    progress: 1,
    message: "Calculation completed",
  };
}

export enum ProgressState {
  FETCHING_CONVERSION_RATES = "FETCHING_CONVERSION_RATES",
  FETCHING_TICKER_DATA = "FETCHING_TICKER_DATA",
  FETCHING_PRICE_HISTORY = "FETCHING_PRICE_HISTORY",
  COMPLETED = "COMPLETED",
}

export interface ProgressDetails {
  state: ProgressState;
  progress: number;
  message: string;
}

type PreloadedAsset = Omit<
  Asset,
  "tickerData" | "currentEuroPrice" | "currentPositionValue"
>;

function getAssetGroups(assets: PreloadedAsset[]): PreloadedAsset[][] {
  const groups: PreloadedAsset[][] = [];

  for (const asset of assets) {
    const matchingGroups = groups.filter((group) =>
      group.some(
        (existing) =>
          existing.isin === asset.isin ||
          existing.relatedIsins.includes(asset.isin) ||
          asset.relatedIsins.includes(existing.isin)
      )
    );

    if (matchingGroups.length === 0) {
      groups.push([asset]);
    } else {
      // Merge all matching groups and the current asset into one group
      const mergedGroup = [asset];
      for (const group of matchingGroups) {
        mergedGroup.push(...group);
        groups.splice(groups.indexOf(group), 1); // remove merged group
      }
      groups.push(mergedGroup);
    }
  }

  return groups;
}

function mergeAssetGroup(group: PreloadedAsset[]): PreloadedAsset {
  if (group.length === 1) return group[0];

  const primaryAsset = group.sort(
    (a, b) => b.details.quantity - a.details.quantity
  )[0];
  const mergedAsset: PreloadedAsset = {
    ...primaryAsset,
    accountTransactions: group.flatMap((asset) => asset.accountTransactions),
    depotTransactions: group.flatMap((asset) => asset.depotTransactions),
    relatedIsins: Array.from(
      new Set(group.flatMap((asset) => asset.relatedIsins))
    ),
    details: mergeDepotItemDetails(group.map((asset) => asset.details)),
  };
  return mergedAsset;
}

export function useAssetsCalc(depotItems: DepotItem[]) {
  const details = useDepotItemDetails(depotItems);
  const firstInvestmentDate = details.reduce((earliest, item) => {
    const firstTxDate = item.details.investment.transactions[0]?.date;

    if (!firstTxDate) return earliest;

    return firstTxDate < earliest ? firstTxDate : earliest;
  }, new Date());

  const { data: conversionRates, isLoading: conversionRatesIsLoading } =
    useConversionRates();

  const preloadedAssets: PreloadedAsset[] = depotItems.map((item) => ({
    ...item,
    details: details.find((d) => d.isin === item.isin)?.details,
  }));
  const assetGroups = getAssetGroups(preloadedAssets);

  const mergedAssets = assetGroups.map((group) => mergeAssetGroup(group));
  const { progress: tickerDataProgress, data } = useTickerDatas(
    mergedAssets.map((item) => item.isin)
  );

  const assets: Asset[] = mergedAssets.map((asset) => {
    const item = data.find((d) => d.isin === asset.isin);
    const priceDataAvailable =
      !conversionRatesIsLoading && item?.tickerData !== undefined;
    let currentEuroPrice = priceDataAvailable
      ? getEuroPrice(
          item?.tickerData?.regularMarketPrice,
          conversionRates,
          item.tickerData.currency
        )
      : null;
    let currentPositionValue = priceDataAvailable
      ? asset.details.quantity * currentEuroPrice
      : null;
    return {
      ...asset,
      tickerData: item?.tickerData ?? null,
      currentEuroPrice,
      currentPositionValue,
    };
  });

  const allTickers =
    tickerDataProgress === 1
      ? assets.map((a) => a.tickerData?.symbol ?? "")
      : [];

  const { data: priceHistory, isLoading: priceHistoryIsLoading } =
    usePriceHistory({
      end: new Date().toISOString().split("T")[0],
      start: firstInvestmentDate.toISOString().split("T")[0],
      tickers: allTickers,
    });

  if (!priceHistoryIsLoading && priceHistory) {
    assets.forEach((asset) => {
      const ticker = asset.tickerData?.symbol;
      if (ticker && priceHistory.prices[ticker]) {
        asset.priceHistory = priceHistory.prices[ticker].map(
          (price, index) => ({
            date: priceHistory.dates[index],
            price:
              price === 0 && index > 0
                ? getEuroPrice(
                    priceHistory.prices[ticker][index - 1],
                    conversionRates,
                    asset.tickerData?.currency
                  )
                : getEuroPrice(
                    price,
                    conversionRates,
                    asset.tickerData?.currency
                  ),
          })
        );
      } else {
        asset.priceHistory = [];
      }
    });
  }

  return {
    progress: getProgressState(
      conversionRatesIsLoading,
      tickerDataProgress,
      priceHistoryIsLoading
    ),
    assets,
  };
}

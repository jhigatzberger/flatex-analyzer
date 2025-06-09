import { FullTickerData } from "../../lib/finance/schemas";
import { DepotItemDetails } from "../hooks/use-depot-item-details";
import { DepotItem } from "./depot-item";

export interface Asset extends DepotItem {
  details: DepotItemDetails;
  tickerData: FullTickerData | null;
  currentEuroPrice: number | null;
  currentPositionValue: number | null;
  priceHistory?: { date: string; price: number }[];
}
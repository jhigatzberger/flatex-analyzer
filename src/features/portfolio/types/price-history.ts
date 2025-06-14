export interface PriceHistoryResponse {
  dates: string[];
  prices: Record<string, number[]>;
}

export interface UsePriceHistoryParams {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD
  tickers: string[];
}

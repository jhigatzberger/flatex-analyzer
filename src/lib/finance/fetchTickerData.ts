import { getEnv } from "../env";
import { FullTickerData } from "./schemas";

export async function fetchTickerData(ticker: string): Promise<FullTickerData> {
  const url = `${env.YAHOO_FINANCE_WRAPPER_URL}stock/${ticker}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ticker data for ${ticker}`);
  }

  const data = await response.json();

  return data;
}

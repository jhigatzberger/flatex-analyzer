import { NextRequest, NextResponse } from "next/server";
import { cache } from "../../../lib/cache";
import { getEnv } from "../../../lib/env";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const tickers = searchParams.getAll("ticker");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const cacheKey = `price-history:${tickers.join(",")}:${start}:${end}`;

  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for ISIN: ${cacheKey}`);
      return NextResponse.json(cached);
    }
  }

  if (!tickers.length || !start || !end) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const baseUrl = getEnv().YAHOO_FINANCE_WRAPPER_URL;

  if (!baseUrl) {
    return NextResponse.json(
      { error: "Server misconfiguration: missing YAHOO_FINANCE_WRAPPER_URL" },
      { status: 500 }
    );
  }

  const flaskUrl = new URL("stocks/close_prices_range", baseUrl);
  tickers.forEach((ticker) => flaskUrl.searchParams.append("ticker", ticker));
  flaskUrl.searchParams.set("start", start);
  flaskUrl.searchParams.set("end", end);

  try {
    const res = await fetch(flaskUrl.toString(), { method: "GET" });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    cache.set(cacheKey, data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch from Flask API" },
      { status: 500 }
    );
  }
}

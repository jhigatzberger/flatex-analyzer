import { NextRequest, NextResponse } from "next/server";
import PQueue from "p-queue";
import { LRUCache } from "lru-cache";
import { fetchTickerData } from "@/app/features/portfolio/server/fetchTickerData";
import { ISINQuerySchema } from "@/app/features/portfolio/types/yahoo-finance-schemas";
import { searchSymbol } from "@/app/features/portfolio/server/searchSymbol";
import { cache } from "@/lib/cache";

const isinSymbolCache = new LRUCache<string, string>({
  max: 10000,
  ttl: 1000 * 60 * 10000,
});

const yahooQueue = new PQueue({
  concurrency: 1,
  interval: 1000,
  intervalCap: 1,
});

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams);

  const parsedQuery = ISINQuerySchema.safeParse(queryParams);
  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: parsedQuery.error.format() },
      { status: 400 }
    );
  }

  const { isin } = parsedQuery.data;

  if (cache.has(isin)) {
    const cached = cache.get(isin);
    if (cached) {
      console.log(`Cache hit for ISIN: ${isin}`);
      return NextResponse.json(cached);
    }
  }

  try {
    const result = await yahooQueue.add(async () => {
      let symbol: string | undefined = undefined;
      if (isinSymbolCache.has(isin)) {
        symbol = isinSymbolCache.get(isin);
      }
      if (!symbol) {
        symbol = await searchSymbol(isin);
        if (!symbol) {
          return NextResponse.json(
            { error: `No symbol found for ISIN: ${isin}` },
            { status: 404 }
          );
        }
        isinSymbolCache.set(isin, symbol);
      }
      const tickerData = await fetchTickerData(symbol);
      return { tickerData };
    });

    cache.set(isin, result);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error fetching ISIN data:", err);
    return NextResponse.json(
      { error: err.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

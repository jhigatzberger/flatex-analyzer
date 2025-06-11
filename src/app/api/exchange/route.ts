import { NextRequest, NextResponse } from "next/server";
import { cache } from "../../../lib/cache";
import { getEnv } from "../../../lib/env";

const BASE_CURRENCY = "EUR";

export async function GET(req: NextRequest) {
  const API_URL = getEnv().FRANKFURTER_API_URL;
  console.log("Frankfurter exchange rate API called");

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "Missing 'start' or 'end' query parameter." },
      { status: 400 }
    );
  }

  const cacheKey = `exchangeRates:${start}:${end}`;
  if (cache.has(cacheKey)) {
    console.log("Returning cached exchange rates");
    return NextResponse.json(cache.get(cacheKey));
  }

  try {
    const url = `${API_URL}/${start}..${end}?base=${BASE_CURRENCY}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(
        `Failed to fetch exchange rate data: ${res.statusText} (${url})`
      );
    }

    const data = await res.json();
    cache.set(cacheKey, data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

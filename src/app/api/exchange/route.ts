import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "../../../lib/cache";
import { db } from "../../../db";
import { exchangeRatesTable } from "../../../db/schema";
import dayjs from "dayjs";

const API_KEY = process.env.EXCHANGE_RATE_API_KEY!;
const BASE_CURRENCY = "EUR";

interface ExchangeRateResponse {
  base_code: string;
  conversion_rates: Record<string, number>;
}

async function fetchFromExchangeRateAPI() {
  const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch exchange rate data");
  }

  const data = await res.json();
  return data;
}

async function fetchFromFawazahmed0() {
  const url =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json";
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rate data from Fawaz Ahmed");
  }
  const data = await res.json();
  const rawConversionRates = data["eur"];
  const conversionRates = Object.fromEntries(
    Object.entries(rawConversionRates).map(([key, value]) => [
      key.toUpperCase(),
      value as number,
    ])
  );
  return {
    base_code: "EUR",
    conversion_rates: conversionRates,
  };
}

export async function GET(req: NextRequest) {
  console.log("Exchange rate API called");
  if (cache.has("exchangeRates")) {
    const cachedRates = cache.get("exchangeRates");
    console.log("Returning cached exchange rates");
    return NextResponse.json(cachedRates);
  }
  try {
    const dateStr = dayjs().format("YYYY-MM-DD");
    const existing = await db
      .select()
      .from(exchangeRatesTable)
      .where(eq(exchangeRatesTable.date, dateStr))
      .limit(1);

    if (existing.length > 0) {
      console.log("Returning cached exchange rates for date:", dateStr);
      return NextResponse.json(existing[0]);
    }

    let data: ExchangeRateResponse;
    if (API_KEY) {
      data = await fetchFromExchangeRateAPI();
    } else {
      data = await fetchFromFawazahmed0();
    }

    const insertPayload = {
      date: dateStr,
      base_currency: data.base_code,
      conversion_rates: data.conversion_rates,
    };

    await db.insert(exchangeRatesTable).values(insertPayload);
    cache.set("exchangeRates", insertPayload);
    return NextResponse.json(insertPayload);
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

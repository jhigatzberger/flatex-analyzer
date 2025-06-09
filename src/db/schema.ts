import { pgTable, date, jsonb } from "drizzle-orm/pg-core";

export const exchangeRatesTable = pgTable("exchange_rates", {
  date: date().primaryKey(), // e.g. '2025-05-31'
  conversion_rates: jsonb().notNull(), // store the whole conversion_rates object
});

import { z } from "zod";
import { parseDate } from "../utils/date-parse";

export interface ParsedDepotTransaction {
  Nummer: string;
  Buchtag: Date;
  Valuta: Date;
  ISIN: string;
  Bezeichnung: string;
  Nominal: number;
  "": string;
  Buchungsinformationen: string;
  "TA-Nr.": string;
  Kurs: number;
  _1: string;
  Depot: string;
}

export const DepotTransactionSchema = z.object({
  Nummer: z.string(),
  Buchtag: z.string(),
  Valuta: z.string(),
  ISIN: z.string(),
  Bezeichnung: z.string(),
  Nominal: z.string(),
  "": z.string(),
  Buchungsinformationen: z.string(),
  "TA-Nr.": z.string(),
  Kurs: z.string(),
  _1: z.string(),
  Depot: z.string(),
});

export type DepotTransaction = z.infer<typeof DepotTransactionSchema>;

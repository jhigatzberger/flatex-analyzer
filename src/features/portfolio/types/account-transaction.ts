import { z } from "zod";
import { parseDate } from "../utils/date-parse";

export interface ParsedAccountTransaction {
  Buchtag: Date;
  Valuta: Date;
  "BIC / BLZ": string;
  "IBAN / Kontonummer": string;
  Buchungsinformationen: string;
  "TA-Nr.": string;
  Betrag: number;
  "": string;
  Auftraggeberkonto: string;
  Konto: string;
}

export const AccountTransactionSchema = z.object({
  Buchtag: z.string(),
  Valuta: z.string(),
  "BIC / BLZ": z.string(),
  "IBAN / Kontonummer": z.string(),
  Buchungsinformationen: z.string(),
  "TA-Nr.": z.string(),
  Betrag: z.string(),
  "": z.string(),
  Auftraggeberkonto: z.string(),
  Konto: z.string(),
});

export type AccountTransaction = z.infer<typeof AccountTransactionSchema>;

import { z } from "zod";
import { parseDate } from "../../lib/utils/date-parse";

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

function parseDepotTransactionDataItem(
  data: DepotTransaction
): ParsedDepotTransaction {
  return {
    Nummer: data.Nummer,
    Buchtag: parseDate(data.Buchtag),
    Valuta: parseDate(data.Valuta),
    ISIN: data.ISIN,
    Bezeichnung: data.Bezeichnung,
    Nominal: parseFloat(data.Nominal.replace(",", ".")),
    "": data[""],
    Buchungsinformationen: data.Buchungsinformationen,
    "TA-Nr.": data["TA-Nr."],
    Kurs: parseFloat(data.Kurs.replace(",", ".")),
    _1: data._1,
    Depot: data.Depot,
  };
}

export function handleParseDepotTransactionData(
  data: unknown[]
): ParsedDepotTransaction[] | null {
  const DepotTransactionArraySchema = z.array(DepotTransactionSchema);
  const result = DepotTransactionArraySchema.safeParse(data);
  if (result.success) {
    const tx: DepotTransaction[] = result.data;
    const parsedTx = tx.map(parseDepotTransactionDataItem);
    parsedTx.sort((a, b) => a.Buchtag.getTime() - b.Buchtag.getTime());
    return parsedTx;
  } else {
    return null;
  }
}

export function mergeDepotTransactions(
  transactions: ParsedDepotTransaction[][]
): ParsedDepotTransaction[] {
  const merged: ParsedDepotTransaction[] = [];
  const transactionIds = new Set<string>();

  transactions.flat().forEach((tx) => {
    if (!transactionIds.has(tx["TA-Nr."])) {
      transactionIds.add(tx["TA-Nr."]);
      merged.push(tx);
    }
  });

  return merged;
}

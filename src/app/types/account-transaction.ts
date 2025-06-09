import { z } from "zod";
import { parseDate } from "../../lib/utils/date-parse";

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

function parseAccountTransactionDataItem(
  data: AccountTransaction
): ParsedAccountTransaction {
  return {
    Buchtag: parseDate(data.Buchtag),
    Valuta: parseDate(data.Valuta),
    "BIC / BLZ": data["BIC / BLZ"],
    "IBAN / Kontonummer": data["IBAN / Kontonummer"],
    Buchungsinformationen: data.Buchungsinformationen,
    "TA-Nr.": data["TA-Nr."],
    Betrag: parseFloat(data.Betrag.replace(",", ".")),
    "": data[""],
    Auftraggeberkonto: data.Auftraggeberkonto,
    Konto: data.Konto,
  };
}

export function handleParseAccountTransactionData(
  data: unknown[]
): ParsedAccountTransaction[] | null {
  const AccountTransactionArraySchema = z.array(AccountTransactionSchema);
  const result = AccountTransactionArraySchema.safeParse(data);
  if (result.success) {
    const tx = result.data;
    const parsedTx = tx.map(parseAccountTransactionDataItem);
    parsedTx.sort((a, b) => a.Buchtag.getTime() - b.Buchtag.getTime());
    return parsedTx;
  } else {
    return null;
  }
}

export function mergeAccountTransactions(
  transactions: ParsedAccountTransaction[][]
): ParsedAccountTransaction[] {
  const merged: ParsedAccountTransaction[] = [];
  const transactionIds = new Set<string>();

  transactions.flat().forEach((tx) => {
    if (!transactionIds.has(tx["TA-Nr."])) {
      transactionIds.add(tx["TA-Nr."]);
      merged.push(tx);
    }
  });

  return merged;
}

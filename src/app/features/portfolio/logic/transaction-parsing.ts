import z from "zod";
import {
  AccountTransaction,
  ParsedAccountTransaction,
  AccountTransactionSchema,
} from "../types/account-transaction";
import { parseDate } from "../utils/date-parse";
import { DepotTransaction, ParsedDepotTransaction, DepotTransactionSchema } from "../types/depot-transaction";

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

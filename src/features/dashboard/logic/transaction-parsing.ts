import z from "zod";
import {
  AccountTransaction,
  ParsedAccountTransaction,
  AccountTransactionSchema,
} from "../types/account-transaction";
import { parseDate } from "../utils/date-parse";
import { DepotTransaction, ParsedDepotTransaction, DepotTransactionSchema } from "../types/depot-transaction";
import { anonymizeAccountTransactions, anonymizeDepotTransactions } from "./anonymize-transactions";

// Handles both "1.234,56" (German with thousands sep) and "1234,56"
function parseGermanFloat(value: string): number {
  return parseFloat(value.replace(/\./g, "").replace(",", "."));
}

function normalizeDepotRow(row: Record<string, string>): Record<string, string> {
  if (!("Nominal (Stk.)" in row)) return row;
  return {
    Nummer: "",
    Buchtag: row["Buchungstag"] ?? "",
    Valuta: row["Valuta"] ?? "",
    ISIN: row["ISIN"] ?? "",
    Bezeichnung: row["Bezeichnung"] ?? "",
    Nominal: row["Nominal (Stk.)"] ?? "",
    "": row[""] ?? "",
    Buchungsinformationen: row["Buchungsinformation"] ?? "",
    "TA-Nr.": row["TA.-Nr."] ?? "",
    Kurs: row["Kurs"] ?? "",
    _1: row["_1"] ?? "",
    Depot: "",
  };
}

function normalizeAccountRow(row: Record<string, string>): Record<string, string> {
  if (!("Zahlungspfl." in row)) return row;
  return {
    Buchtag: row["Buchungstag"] ?? "",
    Valuta: row["Valuta"] ?? "",
    "BIC / BLZ": row["Empfänger"] ?? "",
    "IBAN / Kontonummer": row["Zahlungspfl."] ?? "",
    Buchungsinformationen: row["Buchungsinformationen"] ?? "",
    "TA-Nr.": row["TA.Nr."] ?? "",
    Betrag: row["Betrag"] ?? "",
    "": row[""] ?? "",
    Auftraggeberkonto: "",
    Konto: "",
  };
}

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
    Betrag: parseGermanFloat(data.Betrag),
    "": data[""],
    Auftraggeberkonto: data.Auftraggeberkonto,
    Konto: data.Konto,
  };
}

export function handleParseAccountTransactionData(
  data: unknown[]
): ParsedAccountTransaction[] | null {
  const AccountTransactionArraySchema = z.array(AccountTransactionSchema);
  const normalized = data.map((row) => normalizeAccountRow(row as Record<string, string>));
  const result = AccountTransactionArraySchema.safeParse(normalized);
  if (result.success) {
    const tx = anonymizeAccountTransactions(result.data);
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
    Nominal: parseGermanFloat(data.Nominal),
    "": data[""],
    Buchungsinformationen: data.Buchungsinformationen,
    "TA-Nr.": data["TA-Nr."],
    Kurs: parseGermanFloat(data.Kurs),
    _1: data._1,
    Depot: data.Depot,
  };
}

export function handleParseDepotTransactionData(
  data: unknown[]
): ParsedDepotTransaction[] | null {
  const DepotTransactionArraySchema = z.array(DepotTransactionSchema);
  const normalized = data.map((row) => normalizeDepotRow(row as Record<string, string>));
  const result = DepotTransactionArraySchema.safeParse(normalized);
  if (result.success) {
    const tx: DepotTransaction[] = anonymizeDepotTransactions(result.data);
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

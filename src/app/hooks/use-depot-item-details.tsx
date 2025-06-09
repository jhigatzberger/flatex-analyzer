import { DepotItem } from "../types/depot-item";

export interface DividendPayment {
  date: Date;
  value: number;
}

export interface DividendData {
  dividends: DividendPayment[];
  totalValue: number;
}

export interface SingleTransaction {
  date: Date;
  rate: number;
  quantity: number;
}

export interface TransactionData {
  transactions: SingleTransaction[];
  totalValue: number;
  totalQuantity: number;
}

export interface DepotItemDetails {
  quantity: number;
  investment: TransactionData;
  realized: TransactionData;
  dividends: DividendData;
}

function getDepotItemDetails(item: DepotItem): {
  isin: string;
  details: DepotItemDetails;
} {
  let quantity = 0;
  const { isin, depotTransactions, accountTransactions } = item;
  const investment: TransactionData = {
    transactions: [],
    totalValue: 0,
    totalQuantity: 0,
  };
  const realized: TransactionData = {
    transactions: [],
    totalValue: 0,
    totalQuantity: 0,
  };
  const dividends: DividendData = {
    dividends: [],
    totalValue: 0,
  };

  depotTransactions.forEach((tx) => {
    if (tx.Buchungsinformationen.includes("ORDER Kauf")) {
      investment.totalValue += tx.Kurs * tx.Nominal;
      investment.totalQuantity += tx.Nominal;
      investment.transactions.push({
        date: tx.Buchtag,
        quantity: tx.Nominal,
        rate: tx.Kurs,
      });
    }

    if (tx.Buchungsinformationen.includes("ORDER Verkauf")) {
      const quantity = Math.abs(tx.Nominal);
      realized.totalValue += tx.Kurs * quantity;
      realized.totalQuantity += quantity;
      realized.transactions.push({
        date: tx.Buchtag,
        quantity,
        rate: tx.Kurs,
      });
    }

    quantity += tx.Nominal;
  });

  accountTransactions.forEach((accTx) => {
    if (accTx.Buchungsinformationen.includes("Dividendenzahlung")) {
      const dividendValue = accTx.Betrag;
      dividends.dividends.push({
        date: accTx.Buchtag,
        value: dividendValue,
      });
      dividends.totalValue += dividendValue;
    }
  });

  return {
    isin,
    details: {
      quantity,
      investment,
      realized,
      dividends,
    },
  };
}

export function useDepotItemDetails(
  depotItems: DepotItem[]
): { isin: string; details: DepotItemDetails }[] {
  return depotItems.map((item) => getDepotItemDetails(item));
}

export function mergeDepotItemDetails(
  details: DepotItemDetails[]
): DepotItemDetails {
  const merged: DepotItemDetails = {
    quantity: 0,
    investment: {
      transactions: [],
      totalValue: 0,
      totalQuantity: 0,
    },
    realized: {
      transactions: [],
      totalValue: 0,
      totalQuantity: 0,
    },
    dividends: {
      dividends: [],
      totalValue: 0,
    },
  };
  details.forEach((detail) => {
    merged.quantity += detail.quantity;
    merged.investment.totalValue += detail.investment.totalValue;
    merged.investment.totalQuantity += detail.investment.totalQuantity;
    merged.investment.transactions.push(...detail.investment.transactions);
    merged.realized.totalValue += detail.realized.totalValue;
    merged.realized.totalQuantity += detail.realized.totalQuantity;
    merged.realized.transactions.push(...detail.realized.transactions);
    merged.dividends.totalValue += detail.dividends.totalValue;
    merged.dividends.dividends.push(...detail.dividends.dividends);
  });

  merged.investment.transactions.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  merged.realized.transactions.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  merged.dividends.dividends.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
  return merged;
}

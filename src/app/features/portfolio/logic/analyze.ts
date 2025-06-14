import dayjs from "dayjs";
import { ParsedAccountTransaction } from "../types/account-transaction";
import { Asset } from "../types/asset";

export function getInitialInvestment(
  accountTransactions: ParsedAccountTransaction[]
) {
  let totalInvestment = 0;
  accountTransactions.forEach((tx) => {
    if (tx["IBAN / Kontonummer"]) totalInvestment += tx.Betrag;
  });
  return totalInvestment;
}

export function getCashPosition(
  accountTransactions: ParsedAccountTransaction[]
) {
  let cashPosition = 0;
  accountTransactions.forEach((tx) => {
    cashPosition += tx.Betrag;
  });
  return cashPosition;
}

export function getDepotSum(assets: Asset[]) {
  let depotSum = 0;
  assets.forEach((item) => {
    if (item.currentPositionValue) {
      depotSum += item.currentPositionValue;
    }
  });
  return depotSum;
}

type CashFlow = {
  date: Date;
  value: number;
};

function XIRR(values: number[], dates: Date[], guess: number = 0.1): number {
  // Credits: algorithm inspired by Apache OpenOffice

  // Calculates the resulting amount
  var irrResult = function (values, dates, rate) {
    var r = rate + 1;
    var result = values[0];
    for (var i = 1; i < values.length; i++) {
      result +=
        values[i] /
        Math.pow(r, dayjs(dates[i]).diff(dayjs(dates[0]), "days") / 365);
    }
    return result;
  };

  // Calculates the first derivation
  var irrResultDeriv = function (values, dates, rate) {
    var r = rate + 1;
    var result = 0;
    for (var i = 1; i < values.length; i++) {
      var frac = dayjs(dates[i]).diff(dayjs(dates[0]), "days") / 365;
      result -= (frac * values[i]) / Math.pow(r, frac + 1);
    }
    return result;
  };

  // Check that values contains at least one positive value and one negative value
  var positive = false;
  var negative = false;
  for (var i = 0; i < values.length; i++) {
    if (values[i] > 0) positive = true;
    if (values[i] < 0) negative = true;
  }

  // Return error if values does not contain at least one positive value and one negative value
  if (!positive || !negative) return 0;

  // Initialize guess and resultRate
  var resultRate = guess;

  // Set maximum epsilon for end of iteration
  var epsMax = 1e-10;

  // Set maximum number of iterations
  var iterMax = 50;

  // Implement Newton's method
  var newRate, epsRate, resultValue;
  var iteration = 0;
  var contLoop = true;
  do {
    resultValue = irrResult(values, dates, resultRate);
    newRate =
      resultRate - resultValue / irrResultDeriv(values, dates, resultRate);
    epsRate = Math.abs(newRate - resultRate);
    resultRate = newRate;
    contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
  } while (contLoop && ++iteration < iterMax);

  if (contLoop) return 0;

  // Return internal rate of return
  return resultRate;
}

export function calculateXIRR(
  accountTransactions: ParsedAccountTransaction[],
  assets: Asset[]
) {
  try {
    const currentValue =
      getDepotSum(assets) + getCashPosition(accountTransactions);
    let cashFlows: CashFlow[] = accountTransactions
      .filter((tx) => tx["IBAN / Kontonummer"])
      .map((tx) => ({
        date: new Date(tx.Buchtag),
        value: tx.Betrag * -1,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (cashFlows.length < 2) {
      console.error(
        "At least two cash flows are required for XIRR calculation"
      );
      return 0; // Not enough data to calculate XIRR
    }

    cashFlows = [
      {
        date: new Date(),
        value: currentValue,
      },
      ...cashFlows,
    ];
    return XIRR(
      cashFlows.map((cf) => cf.value),
      cashFlows.map((cf) => cf.date)
    );
  } catch (error) {
    console.error("Error calculating XIRR:", error);
    return 0; // Return 0 or handle error as needed
  }
}

export function getAccumulatedCashFlows(
  startDate: Date,
  endDate: Date,
  accountTransactions: ParsedAccountTransaction[]
): CashFlow[] {
  const cashFlows: CashFlow[] = [];
  let accumulatedValue = 0;

  // Group transactions by date for fast lookup
  const transactionsByDate = new Map<string, ParsedAccountTransaction[]>();
  for (const tx of accountTransactions) {
    if (tx["IBAN / Kontonummer"]) {
      const dateKey = dayjs(tx.Buchtag).format("YYYY-MM-DD");
      if (!transactionsByDate.has(dateKey)) {
        transactionsByDate.set(dateKey, []);
      }
      transactionsByDate.get(dateKey)!.push(tx);
    }
  }

  // Iterate through each day and accumulate
  const start = dayjs(startDate);
  const end = dayjs(endDate);

  for (let date = start; !date.isAfter(end); date = date.add(1, "day")) {
    const dateKey = date.format("YYYY-MM-DD");
    const transactions = transactionsByDate.get(dateKey) || [];

    for (const tx of transactions) {
      accumulatedValue += tx.Betrag;
    }

    cashFlows.push({
      date: date.toDate(),
      value: accumulatedValue,
    });
  }

  return cashFlows;
}

export function getAccumulatedDepotValue(
  assets: Asset[],
  startDate: Date,
  endDate: Date
): { date: Date; value: number | null }[] {
  const start = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).startOf("day");

  const result: { date: Date; value: number | null }[] = [];

  const assetPriceMaps = new Map<Asset, Map<string, number>>();
  const assetQuantityByDate = new Map<Asset, Map<string, number>>();

  for (const asset of assets) {
    const priceMap = new Map<string, number>();
    for (const entry of asset.priceHistory || []) {
      priceMap.set(dayjs(entry.date).format("YYYY-MM-DD"), entry.price);
    }
    assetPriceMaps.set(asset, priceMap);

    const quantityMap = new Map<string, number>();
    let cumulative = 0;
    const sortedTx = [...(asset.depotTransactions || [])].sort(
      (a, b) => new Date(a.Buchtag).getTime() - new Date(b.Buchtag).getTime()
    );

    for (
      let date = start.clone();
      !date.isAfter(end);
      date = date.add(1, "day")
    ) {
      const currentDay = date.format("YYYY-MM-DD");
      for (const tx of sortedTx) {
        if (dayjs(tx.Buchtag).isSame(date, "day")) {
          cumulative += tx.Nominal;
        }
      }
      quantityMap.set(currentDay, cumulative);
    }

    assetQuantityByDate.set(asset, quantityMap);
  }

  // Helper: calculate median
  function median(values: number[]): number | null {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  let weekBuffer: { date: Date; value: number }[] = [];

  for (
    let date = start.clone();
    !date.isAfter(end);
    date = date.add(1, "day")
  ) {
    const dateKey = date.format("YYYY-MM-DD");
    let dailyValue = 0;

    for (const asset of assets) {
      const price = assetPriceMaps.get(asset)?.get(dateKey) ?? 0;
      const quantity = assetQuantityByDate.get(asset)?.get(dateKey) ?? 0;
      dailyValue += price * quantity;
    }

    weekBuffer.push({
      date: date.toDate(),
      value: dailyValue,
    });

    const isEndOfWeek =
      date.date() === 1 || date.date() === 15 || date.isSame(end, "day"); // Sunday or end date
    if (isEndOfWeek) {
      const values = weekBuffer
        .map((entry) => entry.value)
        .filter((v) => v > 0);
      const weekMedian = median(values);

      for (const entry of weekBuffer) {
        result.push({
          date: entry.date,
          value: weekMedian,
        });
      }

      weekBuffer = [];
    }
  }

  return result;
}

export function getAccumulatedCashPosition(
  startDate: Date,
  endDate: Date,
  accountTransactions: ParsedAccountTransaction[]
): { date: Date; value: number }[] {
  const start = dayjs(startDate).startOf("day");
  const end = dayjs(endDate).startOf("day");

  const result: { date: Date; value: number }[] = [];

  // Sort transactions for correct chronological processing
  const sortedTransactions = [...accountTransactions].sort(
    (a, b) => new Date(a.Buchtag).getTime() - new Date(b.Buchtag).getTime()
  );

  let totalCash = 0;
  let txIndex = 0;

  for (
    let date = start.clone();
    !date.isAfter(end);
    date = date.add(1, "day")
  ) {
    const currentDayStr = date.format("YYYY-MM-DD");

    // Process all transactions for the current day
    while (
      txIndex < sortedTransactions.length &&
      dayjs(sortedTransactions[txIndex].Buchtag).format("YYYY-MM-DD") ===
        currentDayStr
    ) {
      totalCash += sortedTransactions[txIndex].Betrag;
      txIndex++;
    }

    result.push({
      date: date.toDate(),
      value: totalCash,
    });
  }

  return result;
}

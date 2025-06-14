import { Stats } from "@/app/features/portfolio/components/stats";
import { DepotProvider } from "@/app/features/portfolio/hooks/use-depot";
import { ParsedAccountTransaction } from "@/app/features/portfolio/types/account-transaction";
import { ParsedDepotTransaction } from "@/app/features/portfolio/types/depot-transaction";
import dayjs from "dayjs";

const fakeDepotData = [
  {
    date: "2020-06-01",
    isin: "US0378331005",
    name: "APPLE INC.",
    quantity: 50,
    rate: 75.0,
  },
  {
    date: "2021-06-01",
    isin: "IE00B4L5Y983",
    name: "ISHARES CORE MSCI WORLD ETF",
    quantity: 50,
    rate: 68.0,
  },
  {
    date: "2022-06-01",
    isin: "US67066G1040",
    name: "NVIDIA CORP.",
    quantity: 50,
    rate: 14.09,
  },
  {
    date: "2024-10-11",
    isin: "DE000FTG1111",
    name: "FLATEXDEGIRO AG",
    quantity: 100,
    rate: 13.99,
  },
];

function generateTransactionsFromFakeDepotData(): {
  depotTransactions: ParsedDepotTransaction[];
  accountTransactions: ParsedAccountTransaction[];
} {
  const externalAccountTransactions: ParsedAccountTransaction[] =
    fakeDepotData.map((item, i) => ({
      "IBAN / Kontonummer": "external-iban",
      "TA-Nr.": "" + (i + 1),
      Buchtag: dayjs(item.date).subtract(5, "day").toDate(),
      Valuta: dayjs(item.date).subtract(5, "day").toDate(),
      "BIC / BLZ": "external-bic",
      Buchungsinformationen: "investment",
      Betrag: Math.round((item.quantity * item.rate) / 1000) * 1000,
      "": "",
      Auftraggeberkonto: "external-account",
      Konto: "external-account",
    }));

  const internalAccountTransactions: ParsedAccountTransaction[] =
    fakeDepotData.map((item, i) => ({
      "IBAN / Kontonummer": "",
      "TA-Nr.": "" + (i + 1 + fakeDepotData.length),
      Buchtag: dayjs(item.date).subtract(1, "day").toDate(),
      Valuta: dayjs(item.date).subtract(1, "day").toDate(),
      "BIC / BLZ": "",
      Buchungsinformationen: "investment",
      Betrag: -item.quantity * item.rate,
      "": "",
      Auftraggeberkonto: "internal-account",
      Konto: "internal-account",
    }));

  return {
    depotTransactions: fakeDepotData.map((item, i) => ({
      "TA-Nr.": "" + (i + 1),
      "": "",
      _1: "",
      Buchtag: new Date(item.date),
      Valuta: new Date(item.date),
      ISIN: item.isin,
      Bezeichnung: item.name,
      Nominal: item.quantity,
      Kurs: item.rate,
      Buchungsinformationen: "Ausführung ORDER Kauf " + item.isin,
      Depot: "",
      Nummer: "",
    })),
    accountTransactions: [
      ...externalAccountTransactions,
      ...internalAccountTransactions,
    ],
  };
}

export default function DemoPage() {
  const { depotTransactions, accountTransactions } =
    generateTransactionsFromFakeDepotData();
  return (
    <DepotProvider
      accountTransactions={accountTransactions}
      depotTransactions={depotTransactions}
    >
      <Stats />
    </DepotProvider>
  );
}

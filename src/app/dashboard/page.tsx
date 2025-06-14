"use client";

import { useState } from "react";

import { Box, Chip, Container, Snackbar } from "@mui/material";
import { Stats } from "@/features/portfolio/components/stats";
import CsvDropzoneUploader from "@/features/portfolio/components/csv-upload";
import { ShowValuesToggle } from "@/features/portfolio/components/show-values-toggle";
import { DepotProvider } from "@/features/portfolio/hooks/use-depot";
import {
  handleParseDepotTransactionData,
  handleParseAccountTransactionData,
  mergeAccountTransactions,
  mergeDepotTransactions,
} from "@/features/portfolio/logic/transaction-parsing";
import { ParsedAccountTransaction } from "@/features/portfolio/types/account-transaction";
import { ParsedDepotTransaction } from "@/features/portfolio/types/depot-transaction";

export default function App() {
  const [depotTransactions, setDepotTransactions] = useState<
    ParsedDepotTransaction[][]
  >([]);
  const [accountTransactions, setAccountTransactions] = useState<
    ParsedAccountTransaction[][]
  >([]);
  const [error, setError] = useState<string | null>(null);

  function handleParsedData(data: unknown[]) {
    console.log("Parsed CSV Data:", data);
    const depotTransactions = handleParseDepotTransactionData(data);
    if (depotTransactions) {
      console.log("Depot Transactions:", depotTransactions);
      setDepotTransactions((prev) => [...prev, depotTransactions]);
      return;
    }
    const accountTransactions = handleParseAccountTransactionData(data);
    if (accountTransactions) {
      console.log("Account Transactions:", accountTransactions);
      setAccountTransactions((prev) => [...prev, accountTransactions]);
      return;
    }
    console.error("No valid transaction data found in the CSV.");
    setError("Keine gültigen Transaktionsdaten in der CSV gefunden.");
  }

  return (
    <Box className="flex flex-col items-center p-4">
      <Container maxWidth="xl">
        <div className="mb-4 flex flex-wrap gap-2 z-10 w-full justify-between items-start">
          <div className="self-start flex items-center gap-2">
            <Chip
              color={depotTransactions.length > 0 ? "success" : "default"}
              label={`Depotumsätze (${depotTransactions.length})`}
              onDelete={
                depotTransactions.length > 0
                  ? () => setDepotTransactions([])
                  : undefined
              }
            />
            <Chip
              color={accountTransactions.length > 0 ? "success" : "default"}
              label={`Kontoumsätze (${accountTransactions.length})`}
              onDelete={
                accountTransactions.length > 0
                  ? () => setAccountTransactions([])
                  : undefined
              }
            />
          </div>
          <ShowValuesToggle />
          <CsvDropzoneUploader onParsed={handleParsedData} />
        </div>
        {depotTransactions.length > 0 && accountTransactions.length > 0 && (
          <DepotProvider
            accountTransactions={mergeAccountTransactions(accountTransactions)}
            depotTransactions={mergeDepotTransactions(depotTransactions)}
          >
            <Stats />
          </DepotProvider>
        )}
      </Container>
      <Snackbar
        color={"error"}
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => {
          setError(null);
        }}
        message={error}
      />
    </Box>
  );
}

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  RawAccountTransactionDataSet,
  RawDataState,
  RawDepotTransactionDataSet,
} from "../types/raw-transaction-data-set";
import {
  handleParseDepotTransactionData,
  handleParseAccountTransactionData,
  mergeDepotTransactions,
  mergeAccountTransactions,
} from "../logic/transaction-parsing";
import {
  AccountTransaction,
  ParsedAccountTransaction,
} from "../types/account-transaction";
import {
  DepotTransaction,
  ParsedDepotTransaction,
} from "../types/depot-transaction";
import {
  createIndexedDBAdapter,
  createRamStorageAdapter,
  StorageAdapter,
} from "@/lib/storage-adapter";
import { useUserConfig } from "@/hooks/use-user-config";
import { DataPersistenceMode } from "@/lib/user-config-schema";
import { createServerAdapter } from "@/lib/raw-data-server-storage-adapter";
import { useEncryptionKey } from "@/hooks/use-encryption-key";
// server adapter: data-persistence-actions.ts + encrypt/decrypt. key in params

interface RawDataContextType {
  depotDataSets: RawDepotTransactionDataSet[];
  accountDataSets: RawAccountTransactionDataSet[];
  parsedDepotTransactions: ParsedDepotTransaction[];
  parsedAccountTransactions: ParsedAccountTransaction[];
  error: string | null;
  isLoading: boolean;
  isPorting: boolean; // We still expose this for specific UI feedback
  handleRawCsvUpload: (data: unknown[], fileName: string) => void;
  deleteDepotDataSet: (id: string) => void;
  deleteAccountDataSet: (id: string) => void;
}

const RawDataContext = createContext<RawDataContextType | undefined>(undefined);
const defaultRawData: RawDataState = { depot: [], account: [] };

export const RawDataProvider = ({ children }: { children: ReactNode }) => {
  const { config, isLoading: isConfigLoading } = useUserConfig();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const queryKey = ["rawTransactionData", config?.dataPersistenceMode];

  const { key, isLoading: isEncryptionKeyLoading } = useEncryptionKey();

  const adapterMap = useMemo<
    Partial<Record<DataPersistenceMode, StorageAdapter<RawDataState>>>
  >(
    () => ({
      local: createIndexedDBAdapter<RawDataState>("raw_transaction_data"),
      none: createRamStorageAdapter<RawDataState>(defaultRawData),
      server: createServerAdapter(key),
    }),
    [key]
  );

  useEffect(() => {
    queryClient.refetchQueries();
  }, [key]);

  const { data: rawData, isLoading: isDataLoading } = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const adapter = adapterMap[config?.dataPersistenceMode];
      if (!adapter) return defaultRawData;
      return (await adapter.load()) ?? defaultRawData;
    },
    enabled: !isConfigLoading && !isEncryptionKeyLoading,
  });

  // --- Mutation for Porting Data ---
  const portDataMutation = useMutation({
    mutationFn: async ({
      oldAdapter,
      newAdapter,
    }: {
      oldAdapter: StorageAdapter<RawDataState>;
      newAdapter: StorageAdapter<RawDataState>;
    }) => {
      const currentData = await oldAdapter.load();
      const dataToPort =
        currentData !== undefined && Object.keys(currentData).length > 0
          ? currentData
          : defaultRawData;
      await newAdapter.save(dataToPort);
      await oldAdapter.clear();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rawTransactionData"] });
      setError(null);
    },
    onError: (err) => {
      console.error("Failed to port data:", err);
      setError("Failed to migrate data to the new storage mode.");
    },
  });

  // --- Effect to Trigger Porting ---
  const previousMode = useRef<DataPersistenceMode>(null);

  useEffect(() => {
    console.log("Checking for initial mode change...");
    if (isConfigLoading || isDataLoading) return;
    const currentMode = config?.dataPersistenceMode;
    if (!previousMode.current) {
      previousMode.current = currentMode;
      return; // Skip the first run
    }
  }, [config?.dataPersistenceMode, isConfigLoading, isDataLoading]);

  useEffect(() => {
    console.log("Checking for data porting...");
    if (isConfigLoading || isDataLoading) return;

    const currentMode = config?.dataPersistenceMode;
    const lastMode = previousMode.current;

    if (!currentMode || currentMode === lastMode) return;

    const oldAdapter = adapterMap[lastMode ?? currentMode];
    const newAdapter = adapterMap[currentMode];

    if (lastMode && oldAdapter && newAdapter) {
      portDataMutation.mutate({ oldAdapter, newAdapter });
    }

    previousMode.current = currentMode;
  }, [config?.dataPersistenceMode, isConfigLoading, isDataLoading]);

  // --- Mutation for User-Initiated Updates ---
  const updateMutation = useMutation({
    mutationFn: async (newData: RawDataState) => {
      const adapter = adapterMap[config?.dataPersistenceMode];
      if (!adapter?.save) throw new Error("Saving is not supported.");
      await adapter.save(newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => {
      setError(`Failed to save data: ${(err as Error).message}`);
      console.error("Error saving raw data:", err);
    },
  });

  // Serialises concurrent uploads so each one reads the latest adapter state.
  const saveQueue = useRef<Promise<void>>(Promise.resolve());

  // --- Event Handlers ---
  const handleRawCsvUpload = (csvData: unknown[], fileName: string) => {
    setError(null);

    const isDepot = !!handleParseDepotTransactionData(csvData);
    const isAccount = !isDepot && !!handleParseAccountTransactionData(csvData);

    if (!isDepot && !isAccount) {
      setError("Keine gültigen Transaktionsdaten in der CSV gefunden.");
      return;
    }

    const id = crypto.randomUUID?.() ?? `${Date.now()}`;
    const timestamp = new Date();
    const entry = { id, data: csvData, fileName, timestamp, valid: true };

    saveQueue.current = saveQueue.current
      .then(async () => {
        const adapter = adapterMap[config?.dataPersistenceMode];
        if (!adapter) return;
        const currentData = (await adapter.load()) ?? defaultRawData;
        const newData: RawDataState = isDepot
          ? { ...currentData, depot: [...currentData.depot, entry] }
          : { ...currentData, account: [...currentData.account, entry] };
        await adapter.save(newData);
        queryClient.invalidateQueries({ queryKey });
      })
      .catch((err) => {
        setError(`Failed to save data: ${(err as Error).message}`);
        console.error("Error saving raw data:", err);
      });
  };

  const deleteDepotDataSet = (id: string) => {
    const currentData = rawData ?? defaultRawData;
    const updated = currentData.depot.filter((ds) => ds.id !== id);
    updateMutation.mutate({ ...currentData, depot: updated });
  };
  const deleteAccountDataSet = (id: string) => {
    const currentData = rawData ?? defaultRawData;
    const updated = currentData.account.filter((ds) => ds.id !== id);
    updateMutation.mutate({ ...currentData, account: updated });
  };

  // --- Memoized Parsed Data ---
  const depotDataSets = rawData?.depot ?? [];
  const accountDataSets = rawData?.account ?? [];

  const parsedDepotTransactions = useMemo(
    () =>
      mergeDepotTransactions(
        depotDataSets.map(
          (ds) => handleParseDepotTransactionData(ds.data) ?? []
        )
      ),
    [depotDataSets]
  );

  const parsedAccountTransactions = useMemo(
    () =>
      mergeAccountTransactions(
        accountDataSets.map(
          (ds) => handleParseAccountTransactionData(ds.data) ?? []
        )
      ),
    [accountDataSets]
  );

  const value: RawDataContextType = {
    depotDataSets,
    accountDataSets,
    parsedDepotTransactions,
    parsedAccountTransactions,
    error,
    // The overall loading state now includes the porting mutation's status
    isLoading:
      isConfigLoading ||
      isDataLoading ||
      updateMutation.isPending ||
      portDataMutation.isPending,
    // isPorting is now derived directly from the mutation's state
    isPorting: portDataMutation.isPending,
    handleRawCsvUpload,
    deleteDepotDataSet,
    deleteAccountDataSet,
  };

  return (
    <RawDataContext.Provider value={value}>{children}</RawDataContext.Provider>
  );
};

export const useRawData = () => {
  const context = useContext(RawDataContext);
  if (!context) {
    throw new Error("useRawData must be used within a RawDataProvider");
  }
  return context;
};

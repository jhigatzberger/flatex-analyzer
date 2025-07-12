// src/hooks/useXirrWorker.ts
import { useEffect, useRef, useState, useCallback } from "react";
import { wrap, Remote } from "comlink";
import type { ParsedAccountTransaction } from "../types/account-transaction";
import type { Asset } from "../types/asset";

// Import worker the Vite/Next way. You may need to tweak this path/setup based on your bundler.
const XirrWorker = () => new Worker(new URL("../workers/xirr.worker.ts", import.meta.url), { type: "module" });

type XirrWorkerApi = {
  calculateXIRR: (
    accountTransactions: ParsedAccountTransaction[],
    sortedItems: Asset[]
  ) => number;
};

export function useXirrWorker(
  accountTransactions: ParsedAccountTransaction[],
  sortedItems: Asset[]
) {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const workerApi = useRef<Remote<XirrWorkerApi> | null>(null);

  useEffect(() => {
    const worker = XirrWorker();
    workerApi.current = wrap<XirrWorkerApi>(worker);
    return () => {
      worker.terminate();
      workerApi.current = null;
    };
  }, []);

  const run = useCallback(async () => {
    if (!workerApi.current) return;
    setLoading(true);
    try {
      const res = await workerApi.current.calculateXIRR(accountTransactions, sortedItems);
      setResult(res);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [accountTransactions, sortedItems]);

  useEffect(() => {
    run();
  }, [run]);

  return { xirr: result, loading };
}

import { useEffect, useState, useRef, useCallback } from "react";
import { wrap, Remote } from "comlink";

const PerformanceChartWorker = () =>
  new Worker(
    new URL("../workers/performance-chart.worker.ts", import.meta.url),
    { type: "module" }
  );

type PrepareChartDataInput = Parameters<
  typeof import("../workers/performance-chart.worker").prepareChartData
>[0];

type ChartData = Awaited<
  ReturnType<typeof import("../workers/performance-chart.worker").prepareChartData>
>;

export function usePerformanceChartWorker(input: PrepareChartDataInput) {
  const [result, setResult] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(false);
  const workerApi = useRef<Remote<any> | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    const worker = PerformanceChartWorker();
    workerApi.current = wrap(worker);
    try {
      const res = await workerApi.current.prepareChartData(input);
      setResult(res);
    } finally {
      setLoading(false);
      worker.terminate();
      workerApi.current = null;
    }
  }, [input]);

  useEffect(() => {
    run();
  }, [run]);

  return { ...result, loading };
}

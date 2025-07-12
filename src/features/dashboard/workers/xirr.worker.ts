// src/workers/xirr.worker.ts
import { calculateXIRR } from "@/features/dashboard/logic/analyze";
import { expose } from "comlink";

// Expose only the function you want to run in the worker
expose({
  calculateXIRR,
});

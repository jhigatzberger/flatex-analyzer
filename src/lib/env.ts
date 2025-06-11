import { z } from 'zod';

const envSchema = z.object({
  YAHOO_FINANCE_WRAPPER_URL: z.string().url(),
  FRANKFURTER_API_URL: z.string().url(),
});

export const env = envSchema.parse({
  YAHOO_FINANCE_WRAPPER_URL: process.env.YAHOO_FINANCE_WRAPPER_URL,
  FRANKFURTER_API_URL: process.env.FRANKFURTER_API_URL,
});

import { z } from 'zod';

const envSchema = z.object({
  FRANKFURTER_API_URL: z.string().url(),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv(): z.infer<typeof envSchema> {
  if (!cachedEnv) {
    cachedEnv = envSchema.parse({
      FRANKFURTER_API_URL: process.env.FRANKFURTER_API_URL,
    });
  }
  return cachedEnv;
}

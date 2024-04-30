import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    OPENAI_API_KEY: z.string().min(1),
  },

  clientPrefix: "NEXT_PUBLIC_",

  client: {},
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

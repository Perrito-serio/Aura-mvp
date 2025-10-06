// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  driver: "sqlite",
  dbCredentials: {
    url: "file:./dev.db",
  },
} satisfies Config;
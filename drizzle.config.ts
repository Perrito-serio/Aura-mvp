// drizzle.config.ts (Versión Alternativa)
import { Config } from "drizzle-kit";

export default {
  schema: "./src/drizzle/schema.ts",
  out: "./src/drizzle/migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "./dev.db",
  },
} satisfies Config;
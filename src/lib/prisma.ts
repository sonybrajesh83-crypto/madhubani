import { copyFileSync, existsSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

function resolveDatabaseUrl() {
  if (process.env.VERCEL) {
    const tmpDb = "/tmp/madhubani.db";
    const bundledDb = path.join(process.cwd(), "prisma", "dev.db");
    if (!existsSync(tmpDb) && existsSync(bundledDb)) {
      copyFileSync(bundledDb, tmpDb);
    }
    return `file:${tmpDb}`;
  }

  return process.env.DATABASE_URL ?? "file:./prisma/dev.db";
}

process.env.DATABASE_URL = resolveDatabaseUrl();

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

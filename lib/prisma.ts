import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple instances of Prisma Client in dev mode
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;

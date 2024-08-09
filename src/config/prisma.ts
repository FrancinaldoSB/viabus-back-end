import { PrismaClient } from "@prisma/client";

const database = new PrismaClient({
  log: ["info", "error", "query", "warn"],
  errorFormat: "pretty",
});

export default database;

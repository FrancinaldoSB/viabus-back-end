import { type Context, type Next } from "hono";
import { UnauthorizedError } from "../utils/errors";
import prisma from "../infrastructure/client/prisma";

export async function authenticatedUser(c: Context, next: Next) {
  const sessionUserEmail = c.get("session")?.email;

  if (!sessionUserEmail)
    throw new UnauthorizedError("User is not authenticated.");

  const user = await prisma.user.findUnique({
    where: { email: sessionUserEmail },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!user) throw new UnauthorizedError("User not found.");

  c.set("authenticatedUser", {
    ...user,
  });

  await next();
}

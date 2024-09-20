import { Context, Next } from "hono";
import { RoleEnum } from "../interfaces/enums/roleEnum";
import { User } from "@prisma/client";

export const authorizeRole = (allowedRoles: RoleEnum[]) => {
  return async (c: Context, next: Next) => {
    const authenticatedUser = c.get("authenticatedUser") as User;

    if (
      !authenticatedUser ||
      !allowedRoles.includes(authenticatedUser.role as RoleEnum)
    ) {
      return c.json({ error: "Acesso negado" }, 403);
    }

    await next();
  };
};

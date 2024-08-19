import { Context, Next } from "hono";
import { RoleEnum } from "../models/enums/roleEnum";

export const authorizeRole = (allowedRoles: RoleEnum[]) => {
  return async (c: Context, next: Next) => {
    const authenticatedUser = c.get("authenticatedUser");

    if (!authenticatedUser || !allowedRoles.includes(authenticatedUser.role)) {
      return c.json({ error: "Acesso negado" }, 403);
    }

    await next();
  };
};

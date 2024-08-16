import { Context, Next } from "hono";
import { RoleEnum } from "../enums/roleEnum";

export const authorizeRole = (allowedRoles: RoleEnum[]) => {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user || !allowedRoles.includes(user.role)) {
      return c.json({ error: "Acesso negado" }, 403);
    }

    await next();
  };
};

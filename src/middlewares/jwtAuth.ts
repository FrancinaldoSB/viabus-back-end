import { Context, Next } from "hono";
import { JwtPayload, verify } from "jsonwebtoken";
import { UsersController } from "../controllers/usersController";

const usersController = new UsersController();

export const jwtAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Token não fornecido ou inválido" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const user = await usersController.fetchUserByEmail(decoded.email);
    if (!user) {
      return c.json({ error: "Usuário não encontrado" }, 404);
    }

    c.set("user", {
      id: user.id,
      role: user.role.trim(),
      email: user.email.trim(),
    });

    await next();
  } catch (error) {
    return c.json({ error: "Token inválido" }, 401);
  }
};

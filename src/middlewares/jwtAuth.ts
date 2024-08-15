import { Context, Next } from "hono";
import { verify } from "jsonwebtoken";

export const jwtAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Token não fornecido ou inválido" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    c.set("user", decoded); // Armazenar o usuário decodificado no contexto
    await next();
  } catch (error) {
    return c.json({ error: "Token inválido" }, 401);
  }
};

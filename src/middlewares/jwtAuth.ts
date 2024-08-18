import { Context, Next } from "hono";
import { OAuth2Client } from "google-auth-library";

import { UnauthorizedError } from "../utils/errors";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const jwtAuth = async (c: Context, next: Next) => {
  const accessToken = c.req.header("Authorization")?.replace("Bearer ", "");

  if (!accessToken) throw new UnauthorizedError("Token não fornecido");

  const ticket = await client.verifyIdToken({
    idToken: accessToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) throw new UnauthorizedError("Token inválido");

  c.set("session", {
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
  });

  await next();
};

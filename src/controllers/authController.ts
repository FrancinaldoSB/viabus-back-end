import { Context } from "hono";
import { userSchema } from "../schema/userSchema";
import { UserService } from "../services/userService";
import { User } from "@prisma/client";
import { createResponse } from "../utils/response";
import { ValidationError, NotFoundError, makeError } from "../utils/errors"; // Importar erros personalizados
import { StatusCode } from "hono/utils/http-status";

const userService = new UserService();

export class AuthController {
  async checkUser(c: Context) {
    try {
      const session = c.get("session") as User;
      if (!session) throw new ValidationError("Sessão não encontrada");

      const email = session.email;
      const user = await userService.getUserByEmail(email);

      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      c.status(200);
      return c.json(createResponse(true, user, "Usuário encontrado"));
    } catch (error) {
      const { statusCode, error: formattedError } = makeError(error as Error);
      c.status(statusCode as StatusCode);
      return c.json(createResponse(false, null, formattedError.message));
    }
  }

  async signUp(c: Context) {
    try {
      const session = c.get("session") as User;
      if (!session) throw new ValidationError("Sessão inválida");

      const existingUser = await userService.getUserByEmail(session.email);

      if (existingUser) {
        c.status(200);
        return c.json(createResponse(true, existingUser, "Usuário já existe"));
      }

      const validate = userSchema.safeParse({
        name: session.name,
        email: session.email,
        photo_url: session.photo_url,
      });

      if (!validate.success) {
        throw new ValidationError("Dados inválidos");
      }

      const newUser = {
        name: session.name,
        email: session.email,
        photo_url: session.photo_url as string,
      } as User;

      const user = await userService.createUser(newUser);

      c.status(201);
      return c.json(createResponse(true, user, "Usuário criado com sucesso"));
    } catch (error) {
      const { statusCode, error: formattedError } = makeError(error as Error);
      c.status(statusCode as StatusCode);
      return c.json(createResponse(false, null, formattedError.message));
    }
  }
}

import { Context } from "hono";
import { userSchema } from "../schema/userSchema";
import { UserService } from "../services/userService";
import { User } from "@prisma/client";

const userService = new UserService();

export class AuthController {
  async checkUser(c: Context) {
    try {
      const session = c.get("session") as User;
      const email = session.email;

      const user = await userService.getUserByEmail(email);

      if (!user) {
        return c.json(
          {
            ok: false,
            message: "Usuário não encontrado",
            data: null,
          },
          404
        );
      }

      return c.json(
        {
          ok: true,
          message: "Usuário encontrado",
          data: user,
        },
        200
      );
    } catch (error) {
      return c.json(
        {
          ok: false,
          message: "Erro interno ao verificar usuário",
          error,
        },
        500
      );
    }
  }

  async signUp(c: Context) {
    try {
      const session = c.get("session") as User;

      const existingUser = await userService.getUserByEmail(session.email);

      if (existingUser) {
        return c.json(
          {
            ok: true,
            message: "Usuário já existe",
            data: existingUser,
          },
          200
        );
      }

      const validate = userSchema.safeParse({
        name: session.name,
        email: session.email,
        photo_url: session.photo_url,
      });

      if (!validate.success) {
        return c.json(
          {
            ok: false,
            message: "Dados inválidos",
            errors: validate.error.errors,
          },
          400
        );
      }

      const user = await userService.createUser({
        name: session.name,
        email: session.email,
        photo_url: session.photo_url as string,
      });

      return c.json(
        {
          ok: true,
          message: "Usuário criado com sucesso",
          data: user,
        },
        201
      );
    } catch (error) {
      return c.json(
        {
          ok: false,
          message: "Erro interno ao criar usuário",
          error,
        },
        500
      );
    }
  }
}

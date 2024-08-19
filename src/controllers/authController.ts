import { Context } from "hono";
import prisma from "../infrastructure/client/prisma";
import { userSchema } from "../schema/userSchema";

export class AuthController {
  async checkUser(c: Context) {
    try {
      const session = c.get("session");
      const email = session?.email;

      const user = await prisma.user.findUnique({
        where: { email },
      });

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
      const session = c.get("session");
      const { name, email, picture: photo_url } = session;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

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
        name: name,
        email: email,
        photo_url: photo_url,
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

      const user = await prisma.user.create({
        data: {
          name,
          email,
          photo_url,
        },
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

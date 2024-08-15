import { Context } from "hono";
import prisma from "../client/prisma";
import { userSchema } from "../schema/userSchema";

export class UsersController {
  async getAll(c: Context) {
    try {
      const users = await prisma.user.findMany({ orderBy: { id: "asc" } });

      return c.json(
        {
          message: "Success fetch all users",
          data: users,
        },
        200
      );
    } catch (e: unknown) {
      console.error(`Error getting users ${e}`);
      return c.json(
        {
          message: "Error getting users",
          error: e,
        },
        500
      );
    }
  }

  async getUserById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      return prisma.user
        .findUnique({
          where: { id },
        })
        .then((user) => {
          if (!user) {
            return c.json(
              {
                message: "User not found",
              },
              404
            );
          }

          return c.json(
            {
              message: "Success fetch user",
              data: user,
            },
            200
          );
        });
    } catch (e: unknown) {
      console.error(`Error getting user ${e}`);
      return c.json(
        {
          message: "Error getting user",
          error: e,
        },
        500
      );
    }
  }

  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const { name, email, photo_url } = body;

      // Verificar se o usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return c.json(
          {
            message: "User already exists",
            data: existingUser,
          },
          200
        );
      }

      // Se o usuário não existir, criar um novo
      const validate = userSchema.safeParse({
        name,
        email,
        photo_url,
      });

      if (!validate.success) {
        return c.json(
          {
            message: "Invalid data",
            errors: validate.error.errors,
          },
          400
        );
      }

      const user = await prisma.user.create({
        data: {
          name: validate.data.name,
          email: validate.data.email,
          photo_url: validate.data.photo_url,
        },
      });

      return c.json(
        {
          message: "User created",
          data: user,
        },
        201
      );
    } catch (e: unknown) {
      console.error(`Error creating user ${e}`);
      return c.json(
        {
          message: "Error creating user",
          error: e,
        },
        500
      );
    }
  }

  async updateUser(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      const body = await c.req.json();
      const { name, email, photo_url } = body;
      const validate = userSchema.safeParse({
        name,
        email,
        photo_url,
      });

      if (!validate.success) {
        return c.json(
          {
            message: "Invalid data",
            errors: validate.error.errors,
          },
          400
        );
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          name: validate.data.name,
          email: validate.data.email,
          photo_url: validate.data.photo_url,
        },
      });

      return c.json(
        {
          message: "User updated",
          data: user,
        },
        200
      );
    } catch (e: unknown) {
      console.error(`Error updating user ${e}`);
      return c.json(
        {
          message: "Error updating user",
          error: e,
        },
        500
      );
    }
  }

  async deleteUser(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      await prisma.user.delete({
        where: { id },
      });

      return c.json(
        {
          message: "User deleted",
        },
        200
      );
    } catch (e: unknown) {
      console.error(`Error deleting user ${e}`);
      return c.json(
        {
          message: "Error deleting user",
          error: e,
        },
        500
      );
    }
  }
}

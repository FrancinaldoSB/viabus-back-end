import { Context } from "hono";
import prisma from "../client/prisma";
import { userSchema } from "../schema/userSchema";

export class UsersController {
  async fetchUsers(c: Context) {
    try {
      const users = await prisma.user.findMany({
        orderBy: { id: "asc" },
      });

      return c.json(users, 200);
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

  async fetchUserById(c: Context) {
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

          return c.json(user, 200);
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

  async fetchUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, email: true },
    });
  }

  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const { name, email, photo_url } = body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return c.json(existingUser, 200);
      }

      const validate = userSchema.safeParse({
        name: name,
        email: email,
        photo_url: photo_url,
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

      return c.json(user, 201);
    } catch (e: unknown) {
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
      const userAuth = c.get("user");
      const id = Number(c.req.param("id"));
      const body = await c.req.json();

      if (userAuth.id !== id && c.get("user").role !== "admin") {
        return c.json(
          {
            message: "Unauthorized",
          },
          401
        );
      }

      const { name, email, photo_url, role } = body;
      const validate = userSchema.safeParse({
        name: name,
        email: email,
        photo_url: photo_url,
        role: role,
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
          role: validate.data.role,
        },
      });

      return c.json(user, 200);
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
      const userAuth = c.get("user");

      if (userAuth.id !== id && c.get("user").role !== "admin") {
        return c.json(
          {
            message: "Unauthorized",
          },
          401
        );
      }
      
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

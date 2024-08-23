import { Context } from "hono";
import { UserService } from "../services/userService";
import { userSchema } from "../schema/userSchema";
import { User } from "../interfaces/user";
import { RoleEnum } from "../interfaces/enums/roleEnum";

const userService = new UserService();

export class UsersController {
  async fetchUsers(c: Context) {
    try {
      const users = await userService.getUsers();

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
      const user = await userService.getUserById(id);

      if (!user) {
        return c.json(
          {
            message: "User not found",
          },
          404
        );
      }

      return c.json(user, 200);
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

  async fetchUserByEmail(c: Context) {
    try {
      const email = c.req.param("email");
      const user = await userService.getUserByEmail(email);

      if (!user) {
        return null;
      }

      return c.json(user, 200);
    } catch (e: unknown) {
      console.error(`Error getting user ${e}`);
      return null;
    }
  }

  async createUser(c: Context) {
    try {
      const body = await c.req.json();
      const { name, email, photo_url } = body;

      const existingUser = await userService.getUserByEmail(email);

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

      const user: User = {
        name: validate.data.name,
        email: validate.data.email,
        photo_url: validate.data.photo_url!,
      };

      const newUser = await userService.createUser(user);

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
      const body = await c.req.json();

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

      const user: User = {
        id: Number(c.req.param("id")),
        name: validate.data.name,
        email: validate.data.email,
        photo_url: validate.data.photo_url || "",
        role: validate.data.role as RoleEnum,
      };

      const updatedUser = await userService.updateUser(user);

      return c.json(updatedUser, 200);
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

      const deletedUser = await userService.deleteUser(id);

      return c.json(deletedUser, 200);
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

import { User } from "@prisma/client";
import prisma from "../infrastructure/client/prisma";

export class UserService {
  async getUsers() {
    // This method should return all users from the database

    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });

    return users;
  }

  async getUserById(id: number) {
    // This method should return a user from the database

    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  }

  async getUserByEmail(email: string) {
    // This method should return a user from the database

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, role: true, email: true },
    });

    return user;
  }

  async createUser(user: User) {
    // This method should create a user in the database

    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        photo_url: user.photo_url,
      },
      select: { name: true, role: true, email: true },
    });

    return newUser;
  }

  async updateUser(user: User) {
    // This method should update a user in the database

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        photo_url: user.photo_url,
        role: user.role,
      },
    });

    return updatedUser;
  }

  async deleteUser(id: number) {
    // This method should delete a user from the database

    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return deletedUser;
  }
}

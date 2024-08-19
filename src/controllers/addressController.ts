import { Context } from "hono";
import prisma from "../infrastructure/client/prisma";
import { addressSchema } from "../schema/addressSchema";

export class AddressController {
  async fetchAddressById(c: Context) {
    try {
      const id = Number(c.req.param("id"));
      return prisma.address
        .findUnique({
          where: { id },
        })
        .then((address) => {
          if (!address) {
            return c.json(
              {
                message: "Address not found",
              },
              404
            );
          }

          return c.json(address, 200);
        });
    } catch (e: unknown) {
      console.error(`Error getting address ${e}`);
      return c.json(
        {
          message: "Error getting address",
          error: e,
        },
        500
      );
    }
  }

  async fetchAddressByUserId(c: Context) {
    try {
      const userId = Number(c.req.param("userId"));
      return prisma.address
        .findMany({
          where: { user_id: userId },
        })
        .then((address) => {
          if (!address) {
            return c.json(
              {
                message: "Address not found",
              },
              404
            );
          }

          return c.json(address, 200);
        });
    } catch (e: unknown) {
      console.error(`Error getting address ${e}`);
      return c.json(
        {
          message: "Error getting address",
          error: e,
        },
        500
      );
    }
  }

  async createAddress(c: Context) {
    try {
      const body = await c.req.json();

      const validate = addressSchema.safeParse({
        street: body.street,
        number: body.number,
        complement: body.complement,
        neighborhood: body.neighborhood,
        city_name: body.city_name,
        state: body.state,
        cep: body.cep,
      });

      if (!validate.success) {
        return c.json(
          {
            message: "Invalid address",
            errors: validate.error.errors,
          },
          400
        );
      }

      const address = await prisma.address.create({
        data: {
          user_id: c.get("user").id,
          street: body.street,
          number: body.number,
          complement: body.complement,
          neighborhood: body.neighborhood,
          city_name: body.city_name,
          state: body.state,
          cep: body.cep,
        },
      });

      return c.json(address, 201);
    } catch (error) {
      console.error(`Error creating address ${error}`);
      return c.json(
        {
          message: "Error creating address",
          error,
        },
        500
      );
    }
  }

  async updateAddress(c: Context) {
    try {
      const authId = c.get("user").id;
      const id = Number(c.req.param("id"));
      const body = await c.req.json();

      if (authId !== id) {
        return c.json(
          {
            message: "Unauthorized",
          },
          401
        );
      }

      const validate = addressSchema.safeParse({
        street: body.street,
        number: body.number,
        complement: body.complement,
        neighborhood: body.neighborhood,
        city_name: body.city_name,
        state: body.state,
        cep: body.cep,
      });

      if (!validate.success) {
        return c.json(
          {
            message: "Invalid address",
            errors: validate.error.errors,
          },
          400
        );
      }

      const address = await prisma.address.create({
        data: {
          id,
          user_id: c.get("user").id,
          street: body.street,
          number: body.number,
          complement: body.complement,
          neighborhood: body.neighborhood,
          city_name: body.city_name,
          state: body.state,
          cep: body.cep,
        },
      });

      return c.json(address, 200);
    } catch (error) {
      console.error(`Error updating address ${error}`);
      return c.json(
        {
          message: "Error updating address",
          error,
        },
        500
      );
    }
  }

  async deleteAddress(c: Context) {
    try {
      const authId = c.get("user").id;
      const id = Number(c.req.param("id"));

      if (authId !== id) {
        return c.json(
          {
            message: "Unauthorized",
          },
          401
        );
      }

      await prisma.address.delete({
        where: { id },
      });

      return c.json(
        {
          message: "Address deleted",
        },
        200
      );
    } catch (error) {
      console.error(`Error deleting address ${error}`);
      return c.json(
        {
          message: "Error deleting address",
          error,
        },
        500
      );
    }
  }
}

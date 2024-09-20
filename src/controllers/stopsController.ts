import { Context } from "hono";
import prisma from "../infrastructure/client/prisma";
import { stopSchema } from "../schema/stopSchema";
import { makeError, ValidationError } from "../utils/errors";
import { StatusCode } from "hono/utils/http-status";
import { createResponse } from "../utils/response";

export class StopsController {
  async createStop(c: Context) {
    try {
      const body = await c.req.json();
      console.log(body);
      const {
        name,
        neighborhood,
        street,
        number,
        complement,
        city,
        state,
        cep,
      } = body;

      const validade = stopSchema.safeParse({
        name: name,
        street: street,
        number: Number(number),
        complement: complement ? complement : undefined,
        neighborhood: neighborhood ? neighborhood : undefined,
        city_name: city,
        state: state,
        cep: cep ? Number(cep) : undefined,
      });

      console.log(validade.error);

      if (!validade.success) {
        throw new ValidationError("Dados inválidos");
      }

      const stop = await prisma.stop.create({
        data: {
          name: validade.data.name,
          neighborhood: validade.data.neighborhood,
          street: validade.data.street,
          number: validade.data.number,
          complement: validade.data.complement,
          city_name: validade.data.city_name,
          state: validade.data.state,
          cep: validade.data.cep,
        },
      });

      c.status(201);
      return c.json(createResponse(true, stop, "Parada criada com sucesso"));
    } catch (error) {
      const { statusCode, error: formattedError } = makeError(error as Error);
      c.status(statusCode as StatusCode);
      return c.json(createResponse(false, null, formattedError.message));
    }
  }

  async getStops(c: Context) {
    try {
      console.log("getStops");
      const stops = await prisma.stop.findMany();

      c.status(200);
      return c.json(createResponse(true, stops, "Paradas encontradas"));
    } catch (error) {
      const { statusCode, error: formattedError } = makeError(error as Error);
      c.status(statusCode as StatusCode);
      return c.json(createResponse(false, null, formattedError.message));
    }
  }
}

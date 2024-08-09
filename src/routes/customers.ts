import { Hono, Context } from "hono";
import prisma from "../config/prisma";

const customersRoute = new Hono();

customersRoute.get("/", async (c: Context) => {
  const customers = await prisma.customer.findMany();
  return c.json(customers);
});

customersRoute.get("/:id{[0-9]+}", async (c) => {
  console.log(c.req.param("id"));
  let id = Number(c.req.param("id"));
  const user = await prisma.customer.findUnique({
    where: { id },
  });
  return c.json(user);
});

customersRoute.post("/", async (c) => {
  const body = await c.req.json();
  const { name, cpf } = body;
  const newUser = await prisma.customer.create({ data: { name, cpf } });
  c.status(201);
  return c.json(newUser);
});

customersRoute.put("/:id{[0-9]+}", async (c) => {
  let id = Number(c.req.param("id"));
  const body = await c.req.json();
  const { name, cpf } = body;
  const updatedUser = await prisma.customer.update({
    where: { id },
    data: { name, cpf },
  });
  return c.json(updatedUser);
});

customersRoute.delete("/:id{[0-9]+}", async (c) => {
  let id = Number(c.req.param("id"));
  const deletedUser = await prisma.customer.delete({
    where: { id },
  });
  return c.json(deletedUser);
});

export default customersRoute;

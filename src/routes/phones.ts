import { Hono, Context } from "hono";
import prisma from "../config/prisma";

const telephonesRoute = new Hono();

telephonesRoute.get("/", async (c: Context) => {
  const phones = await prisma.telephone.findMany();
  return c.json(phones);
});

telephonesRoute.get("/:id{[0-9]+}", async (c) => {
  console.log(c.req.param("id"));
  let id = Number(c.req.param("id"));
  const telephone = await prisma.telephone.findUnique({
    where: { id },
  });
  return c.json(telephone);
});

telephonesRoute.post("/", async (c) => {
  const body = await c.req.json();
  const { customerId, number } = body;
  const newUser = await prisma.telephone.create({
    data: { customer_id: customerId, phone_number: number },
  });
  c.status(201);
  return c.json(newUser);
});

telephonesRoute.put("/:id{[0-9]+}", async (c) => {
  let id = Number(c.req.param("id"));
  const body = await c.req.json();
  const { customerId, number } = body;
  const updatedPhone = await prisma.telephone.update({
    where: { id },
    data: { customer_id: customerId, phone_number: number },
  });
  return c.json(updatedPhone);
});

telephonesRoute.delete("/:id{[0-9]+}", async (c) => {
  let id = Number(c.req.param("id"));
  const deletedPhone = await prisma.telephone.delete({
    where: { id },
  });
  return c.json(deletedPhone);
});

export default telephonesRoute;

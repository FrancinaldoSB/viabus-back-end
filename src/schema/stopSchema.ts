import { z } from "zod";

export const stopSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  street: z.string().min(1, "Street name is required"),
  number: z.number().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city_name: z.string().min(1, "City name is required"),
  state: z.string().min(1, "State is required"),
  cep: z.number().optional(),
});

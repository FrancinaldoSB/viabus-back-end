import { z } from "zod";

export const addressSchema = z.object({
  street: z
    .string({
      required_error: "Street is required",
    })
    .trim()
    .min(1, "Street cannot be empty"),
  number: z
    .number({
      required_error: "Number is required",
    })
    .int()
    .min(1, "Number must be greater than 0"),
  complement: z.string().trim().optional().nullable(),
  neighborhood: z
    .string({
      required_error: "Neighborhood is required",
    })
    .trim()
    .min(1, "Neighborhood cannot be empty"),
  city_name: z
    .string({
      required_error: "City is required",
    })
    .trim()
    .min(1, "City cannot be empty"),
  state: z
    .string({
      required_error: "State is required",
    })
    .trim()
    .min(1, "State cannot be empty"),
  cep: z
    .string({
      required_error: "CEP is required",
    })
    .trim()
    .min(1, "CEP cannot be empty")
    .length(8, "CEP must be exactly 8 characters"),
});
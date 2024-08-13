import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(1, "Name cannot be empty"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email"),
  provider_id: z
    .string({
      required_error: "Provider ID is required",
    })
    .trim()
    .min(1, "Provider ID cannot be empty")
    .uuid("Invalid UUID"),
  photo_url: z.string().trim().optional().nullable(),
  cpf: z
    .string()
    .trim()
    .length(11, "CPF must be exactly 11 characters")
    .optional()
    .nullable(),
});

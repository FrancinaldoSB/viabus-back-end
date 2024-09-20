import { User } from "@prisma/client";


export const createResponse = (
  success: boolean,
  data?: User |object | null,
  message?: string
) => {
  return {
    success,
    data,
    message,
  };
};

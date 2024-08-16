import { RoleEnum } from "@prisma/client";

export interface User {
  id: number;
  name: string;
  email: string;
  cpf?: string;
  photo_url?: string;
  created_at: Date;
  role: RoleEnum;
  addresses: Address[];
  tickets: Ticket[];
  telephones: Telephone[];
  trips: Trip[];
}

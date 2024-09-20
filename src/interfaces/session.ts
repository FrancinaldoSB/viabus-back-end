// import { RoleEnum } from "./enums/roleEnum";

// export interface User {
//   // serial identifier for the user
//   id?: number;

//   // required
//   name: string;
//   email: string;

//   // optional
//   role?: RoleEnum;
//   cpf?: string;
//   photo_url?: string;

//   // relationships
//   addresses?: Address[];
//   tickets?: Ticket[];
//   telephones?: Telephone[];
//   trips?: Trip[];

//   // timestamps
//   created_at?: Date;
//   updated_at?: Date;
// }

interface ISession {
  name: string;
  email: string;
  photo_url: string;
}

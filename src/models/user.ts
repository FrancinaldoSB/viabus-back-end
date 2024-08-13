interface User {
  id: number;
  name: string;
  email: string;
  provider_id: string;
  cpf?: string;
  photo_url?: string;
  created_at: Date;
  addresses: Address[];
  tickets: Ticket[];
  telephones: Telephone[];
  role: UserRole;
  trips: Trip[];
}
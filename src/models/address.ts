interface Address {
  id: number;
  user_id: number;
  street: string;
  number: number;
  complement?: string;
  neighborhood: string;
  city_name: string;
  state: string;
  cep: string;
}
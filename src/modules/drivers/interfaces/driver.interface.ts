export interface IDriverResponse {
  id: string;
  name: string;
  cpf: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: Date;
  phone: string;
  email?: string;
  birthDate: Date;
  hireDate: Date;
  status: 'active' | 'inactive' | 'on_leave' | 'suspended';
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDriverFilters {
  name?: string;
  cpf?: string;
  licenseNumber?: string;
  licenseCategory?: string;
  status?: string;
}

import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  companyId: string | null;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  access_token: string;
  user: Omit<User, 'password'>;
  company: Company | null;
}

export interface RegisterResponse {
  message: string;
  user: Omit<User, 'password'>;
}

export interface MeResponse {
  user: Omit<User, 'password'>;
  company: Company | null;
}

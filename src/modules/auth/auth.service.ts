import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../../core/enums/user-role.enum';
import { UserStatus } from '../../core/enums/user-status.enum';
import { CompanyService } from '../companies/company.service';
import { Company } from '../companies/entities/company.entity';
import { UsersService } from '../users/user.service';
import { RegisterDto } from './dto/login.dto';
import {
  AuthResponse,
  JwtPayload,
  MeResponse,
  RegisterResponse,
} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly companyService: CompanyService,
  ) {}

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      this.logger.debug(`Tentativa de login para: ${email}`);

      const user = await this.usersService.findByEmailWithPassword(email);

      const isPasswordValid = await this.usersService.validatePassword(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      this.logger.debug(`Login bem-sucedido para: ${email}`);

      let company: Company | null = null;
      if (user.companyId) {
        company = await this.companyService.findOne(user.companyId);
      }

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      };

      const access_token = this.jwtService.sign(payload);

      const { password: _, ...userWithoutPassword } = user;

      return {
        access_token,
        user: userWithoutPassword,
        company,
      };
    } catch (error) {
      this.logger.error(`Erro no login: ${error.message}`);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Credenciais inválidas');
    }
  }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    try {
      this.logger.debug(`Registrando novo usuário: ${registerDto.email}`);

      const userData = {
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
      };

      const user = await this.usersService.create(userData);

      this.logger.debug(`Usuário registrado com sucesso: ${user.email}`);

      const { password: _, ...userWithoutPassword } = user;

      return {
        message: 'Usuário criado com sucesso',
        user: userWithoutPassword,
      };
    } catch (error) {
      this.logger.error(`Erro no registro: ${error.message}`);
      throw error;
    }
  }

  async getMe(userId: string): Promise<MeResponse> {
    const user = await this.usersService.findOne(userId);

    let company: Company | null = null;
    if (user.companyId) {
      company = await this.companyService.findOne(user.companyId);
    }

    return {
      user,
      company,
    };
  }

  async validateUser(userId: string) {
    try {
      return await this.usersService.findOne(userId);
    } catch (error) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
  }
}

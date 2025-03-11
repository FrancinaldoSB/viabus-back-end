import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../users/user.service';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UserCompanyRole } from '../users/entities/user-company-roles.entity';
import { AxiosResponse } from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private usersService: UsersService,
  ) {}

  async validateToken(token: string): Promise<any> {
    try {
      // Verificar o token com o Auth0
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get('AUTH0_DOMAIN')}/userinfo`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async validateUser(userData: any): Promise<{
    user: User;
    companies: any[];
  }> {
    try {
      // Verificar se o usuário já existe
      let user: User;
      try {
        // Buscar pelo email
        const existingUsers = await this.usersService.findByEmail(
          userData.email,
        );
        user = existingUsers[0];
      } catch (error) {
        // Usuário não existe, criar novo
        const createUserDto: CreateUserDto = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          photoUrl: userData.picture || '',
        };
        user = await this.usersService.create(createUserDto);
      }

      // Buscar as empresas e papéis do usuário
      let userCompanyRoles: UserCompanyRole[] = [];
      try {
        userCompanyRoles = await this.usersService.getUserCompanyRoles(user.id);
      } catch (error) {
        // Usuário não tem papéis em empresas ainda
      }

      // Formatar as empresas para o formato esperado pelo front-end
      const companies = userCompanyRoles.map((role) => ({
        id: role.company.id,
        name: role.company.tradeName,
        slug: role.company.slug,
        logoUrl: role.company.logoUrl,
        role: role.role,
      }));

      return { user, companies };
    } catch (error) {
      throw new UnauthorizedException('Falha na autenticação do usuário');
    }
  }
}

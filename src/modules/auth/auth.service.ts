import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
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
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private configService: ConfigService,
    private httpService: HttpService,
    private usersService: UsersService,
  ) {}

  async validateToken(token: string): Promise<any> {
    try {
      this.logger.debug('Validando token com Auth0');
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

      this.logger.debug(
        `Token validado com sucesso: ${JSON.stringify(response.data)}`,
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Erro ao validar token: ${error.message}`);
      throw new UnauthorizedException('Token inválido');
    }
  }

  async validateUser(userData: any): Promise<{
    user: User;
    companies: any[];
  }> {
    try {
      this.logger.debug(`Validando usuário: ${JSON.stringify(userData)}`);

      // Verificar se o usuário já existe
      let user: User;
      try {
        // Buscar pelo email
        const existingUsers = await this.usersService.findByEmail(
          userData.email,
        );
        this.logger.debug(
          `Usuários encontrados com email ${userData.email}: ${existingUsers.length}`,
        );

        user = existingUsers[0];
        this.logger.debug(`Usuário encontrado: ${JSON.stringify(user)}`);
      } catch (error) {
        this.logger.debug(
          `Usuário não encontrado, criando novo: ${error.message}`,
        );
        // Usuário não existe, criar novo
        const createUserDto: CreateUserDto = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          photoUrl: userData.picture || '',
        };
        user = await this.usersService.create(createUserDto);
        this.logger.debug(`Novo usuário criado: ${JSON.stringify(user)}`);
      }

      // Buscar as empresas e papéis do usuário
      let userCompanyRoles: UserCompanyRole[] = [];
      try {
        userCompanyRoles = await this.usersService.getUserCompanyRoles(user.id);
        this.logger.debug(
          `Papéis do usuário: ${JSON.stringify(userCompanyRoles)}`,
        );
      } catch (error) {
        this.logger.warn(
          `Usuário não tem papéis em empresas: ${error.message}`,
        );
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

      this.logger.debug(
        `Empresas do usuário formatadas: ${JSON.stringify(companies)}`,
      );

      return { user, companies };
    } catch (error) {
      this.logger.error(`Erro na validação do usuário: ${error.message}`);
      throw new UnauthorizedException('Falha na autenticação do usuário');
    }
  }
}

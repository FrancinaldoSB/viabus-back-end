import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCompanyRole } from './entities/user-company-roles.entity';
import { AssignCompanyRoleDto } from './dto/assign-company-role.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserCompanyRole)
    private readonly userCompanyRoleRepository: Repository<UserCompanyRole>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Usuário com este email já existe');
    }

    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['companyRoles', 'companyRoles.company'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['companyRoles', 'companyRoles.company'],
    });
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async assignCompanyRole(
    userId: string,
    assignRoleDto: AssignCompanyRoleDto,
  ): Promise<UserCompanyRole> {
    const user = await this.findOne(userId);

    // Verifica se o usuário já tem um papel nesta empresa
    const existingRole = await this.userCompanyRoleRepository.findOne({
      where: {
        user: { id: userId },
        company: { id: assignRoleDto.companyId },
      },
    });

    if (existingRole) {
      throw new ConflictException('Usuário já possui um papel nesta empresa');
    }

    const userCompanyRole = new UserCompanyRole();
    userCompanyRole.user = user;
    userCompanyRole.company = { id: assignRoleDto.companyId } as any;
    userCompanyRole.role = assignRoleDto.role;
    userCompanyRole.status = assignRoleDto.status;

    return await this.userCompanyRoleRepository.save(userCompanyRole);
  }

  async removeCompanyRole(userId: string, roleId: string): Promise<void> {
    const userCompanyRole = await this.userCompanyRoleRepository.findOne({
      where: {
        id: roleId,
        user: { id: userId },
      },
    });

    if (!userCompanyRole) {
      throw new NotFoundException(`Papel não encontrado para este usuário`);
    }

    await this.userCompanyRoleRepository.remove(userCompanyRole);
  }

  async getUserCompanyRoles(userId: string): Promise<UserCompanyRole[]> {
    const roles = await this.userCompanyRoleRepository.find({
      where: { user: { id: userId } },
      relations: ['company'],
    });

    if (!roles.length) {
      throw new NotFoundException(`Nenhum papel encontrado para este usuário`);
    }

    return roles;
  }
}

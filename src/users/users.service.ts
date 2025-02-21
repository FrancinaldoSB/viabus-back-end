import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserCompanyRole } from './entities/user-company-roles.entity';
import { AssignCompanyRoleDto } from './dto/assign-company-role.dto';
import { UserRole } from './enum/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserCompanyRole)
    private readonly userCompanyRoleRepository: Repository<UserCompanyRole>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['companyRoles', 'companyRoles.role', 'companyRoles.company'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['companyRoles', 'companyRoles.role', 'companyRoles.company'],
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

    const userCompanyRole = this.userCompanyRoleRepository.create({
      user: user,
      company: { id: assignRoleDto.companyId } as any,
      role: assignRoleDto.role as UserRole,
      status: assignRoleDto.status,
    });

    return await this.userCompanyRoleRepository.save(userCompanyRole);
  }

  async removeCompanyRole(
    userId: string,
    companyRoleId: string,
  ): Promise<void> {
    const userCompanyRole = await this.userCompanyRoleRepository.findOne({
      where: {
        id: companyRoleId,
        user: { id: userId },
      },
    });

    if (!userCompanyRole) {
      throw new NotFoundException(`Papel não encontrado para este usuário`);
    }

    await this.userCompanyRoleRepository.remove(userCompanyRole);
  }

  async getUserCompanyRoles(userId: string): Promise<UserCompanyRole[]> {
    return await this.userCompanyRoleRepository.find({
      where: { user: { id: userId } },
      relations: ['company', 'role', 'role.permissions'],
    });
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IsNull, Not, Repository } from 'typeorm';
import { UserRole } from '../../core/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar se email já existe
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['company'],
      select: [
        'id',
        'name',
        'email',
        'phone',
        'photoUrl',
        'role',
        'status',
        'companyId',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['company'],
      select: [
        'id',
        'name',
        'email',
        'phone',
        'photoUrl',
        'role',
        'status',
        'companyId',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['company'],
      select: [
        'id',
        'name',
        'email',
        'password',
        'phone',
        'photoUrl',
        'role',
        'status',
        'companyId',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException(`Usuário com email ${email} não encontrado`);
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async findByCompany(companyId: string): Promise<User[]> {
    return await this.userRepository.find({
      where: { companyId },
      relations: ['company'],
      select: [
        'id',
        'name',
        'email',
        'phone',
        'photoUrl',
        'role',
        'status',
        'companyId',
        'createdAt',
        'updatedAt',
      ],
    });
  }

  /**
   * Busca usuários que têm empresa (companyId não é null) mas ainda têm role CLIENT
   * Usado para corrigir dados de usuários que criaram empresas antes da correção
   */
  async findUsersWithCompanyButClientRole(): Promise<User[]> {
    return await this.userRepository.find({
      where: {
        companyId: Not(IsNull()),
        role: UserRole.CLIENT,
      },
      relations: ['company'],
      select: [
        'id',
        'name',
        'email',
        'phone',
        'photoUrl',
        'role',
        'status',
        'companyId',
        'createdAt',
        'updatedAt',
      ],
    });
  }
}

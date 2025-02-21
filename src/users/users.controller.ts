import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignCompanyRoleDto } from './dto/assign-company-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // rota para atribuir um papel a um usuário
  @Post(':id/company-roles')
  assignCompanyRole(
    @Param('id') userId: string,
    @Body() assignRoleDto: AssignCompanyRoleDto,
  ) {
    return this.usersService.assignCompanyRole(userId, assignRoleDto);
  }

  // rota para remover um papel de um usuário
  @Delete(':userId/company-roles/:roleId')
  removeCompanyRole(
    @Param('userId') userId: string,
    @Param('roleId') roleId: string,
  ) {
    return this.usersService.removeCompanyRole(userId, roleId);
  }

  // rota para listar os papéis de um usuário
  @Get(':id/company-roles')
  getUserCompanyRoles(@Param('id') userId: string) {
    return this.usersService.getUserCompanyRoles(userId);
  }
}

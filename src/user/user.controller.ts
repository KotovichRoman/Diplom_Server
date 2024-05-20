import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async findAll(@Query('search') search?: string): Promise<User[]> {
    return await this.userService.findAll(search);
  }

  @Get('/project/:projectId')
  async findByProjectId(
    @Param('projectId') projectId: number,
  ): Promise<User[]> {
    return await this.userService.findByProjectId(projectId);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  @Get('/role')
  async findAllRoles(): Promise<Role[]> {
    return await this.userService.findAllRoles();
  }

  @Post('/')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  @Put('/:id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.userService.delete(id);
  }
}

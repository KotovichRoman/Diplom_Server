import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Brackets, In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from './entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findAll(search?: string): Promise<User[]> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.isDeactivated = false');

    if (search) {
      const searchLower = `%${search.toLowerCase()}%`;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(user.name) Like :search', { search: searchLower })
            .orWhere('LOWER(user.surname) Like :search', {
              search: searchLower,
            })
            .orWhere('LOWER(user.patronymic) Like :search', {
              search: searchLower,
            });
        }),
      );
    }

    return await query.getMany();
  }

  async findAllByIds(ids: number[]): Promise<User[]> {
    return await this.userRepository.find({
      where: { id: In(ids) },
    });
  }

  async findAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findByCredentials(email: string, password: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email, password: password },
      relations: { role: true },
    });
  }

  async findByProjectId(projectId: number): Promise<User[]> {
    return await this.userRepository.find({
      where: { projects: await this.projectService.findOne(projectId) },
    });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: { role: true },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userRepository.create(createUserDto);
    user.role = await this.roleRepository.findOne({
      where: { id: createUserDto.roleId },
    });
    return await this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, {
      email: updateUserDto.email,
      password: updateUserDto.password,
      name: updateUserDto.name,
      surname: updateUserDto.surname,
      patronymic: updateUserDto.patronymic,
      role: await this.roleRepository.findOne({
        where: { id: updateUserDto.roleId },
      }),
    });

    return await this.userRepository.findOne({
      where: { id: id },
      relations: { role: true },
    });
  }

  async delete(id: number): Promise<void> {
    const user: User = await this.userRepository.findOne({ where: { id: id } });
    user.isDeactivated = true;
    user.chatUsers = [];
    user.projects = [];
    user.tasks = [];

    await this.userRepository.save(user);
  }
}

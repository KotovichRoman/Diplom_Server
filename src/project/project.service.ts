import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({ relations: { users: true } });
  }

  async findByUserId(userId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { users: await this.userService.findOne(userId) },
    });
  }

  async findOne(id: number): Promise<Project> {
    return await this.projectRepository.findOne({ where: { id: id } });
  }

  async findOneWithInformation(id: number): Promise<Project> {
    return await this.projectRepository.findOne({
      where: { id: id },
      relations: { users: true },
    });
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project: Project = new Project();
    project.name = createProjectDto.name;
    project.startedAt = createProjectDto.startedAt;
    project.plannedEndedAt = createProjectDto.plannedEndedAt;
    project.users = await this.userService.findAllByIds(createProjectDto.users);
    await this.projectRepository.save(project);

    return project;
  }
}

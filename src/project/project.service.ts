import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entity/project.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find();
  }

  async findOne(id: number): Promise<Project> {
    return await this.projectRepository.findOne({ where: { id: id } });
  }

  async findOneWithInformation(id: number): Promise<Project> {
    return await this.projectRepository.findOne({
      where: { id: id },
      relations: {
        sections: {
          tasks: true,
        },
      },
    });
  }
}

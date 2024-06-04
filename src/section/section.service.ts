import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from './entity/section.entity';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { ProjectService } from 'src/project/project.service';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionService {
  constructor(
    private readonly projectService: ProjectService,

    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
  ) {}

  async findAll(): Promise<Section[]> {
    return await this.sectionRepository.find();
  }

  async findOne(id: number): Promise<Section> {
    return await this.sectionRepository.findOne({ where: { id: id } });
  }

  async findWithFilters(
    projectId: number,
    userId?: number,
    priority?: string,
    search?: string,
  ): Promise<Section[]> {
    const sections = await this.sectionRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.project', 'project')
      .where('project.id = :projectId', { projectId })
      .leftJoinAndSelect('section.tasks', 'task')
      .leftJoinAndSelect('task.users', 'user')
      .leftJoinAndSelect('task.taskLogs', 'taskLogs')
      .leftJoinAndSelect('taskLogs.taskLogType', 'taskLogType')
      .getMany();

    for (const section of sections) {
      const filteredTasks = section.tasks.filter((task) => {
        let matches = true;

        if (userId && !task.users.some((user) => user.id === userId)) {
          matches = false;
        }
        if (priority && task.priority !== priority) {
          matches = false;
        }
        if (search && !task.name.includes(search)) {
          matches = false;
        }

        return matches;
      });

      section.tasks = filteredTasks;
    }

    return sections;
  }

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const newSection: Section =
      await this.sectionRepository.create(createSectionDto);
    newSection.project = await this.projectService.findOne(
      createSectionDto.projectId,
    );
    return await this.sectionRepository.save(newSection);
  }

  async update(
    id: number,
    updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    const section: Section = await this.sectionRepository.findOne({
      where: { id: id },
    });
    section.name = updateSectionDto.name;
    return await this.sectionRepository.save(section);
  }

  async delete(id: number): Promise<void> {
    await this.sectionRepository.delete(id);
  }
}

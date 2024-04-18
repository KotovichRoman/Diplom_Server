import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { Repository, DataSource } from 'typeorm';
import { SectionService } from 'src/section/section.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly sectionService: SectionService,

    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async findBySectionId(sectionId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: {
        section: await this.sectionService.findOne(sectionId),
      },
    });
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const newTask = await this.taskRepository.create(createTaskDto);
    newTask.section = await this.sectionService.findOne(
      createTaskDto.sectionId,
    );

    return await this.taskRepository.save(newTask);
  }

  async updateSectionId(id: number, sectionId: number): Promise<void> {
    await this.taskRepository.update(id, {
      section: await this.sectionService.findOne(sectionId),
    });
  }

  async updatePosition(id: number, swipeTaskId: number): Promise<void> {
    const query = `
      UPDATE task
      SET position = case
        WHEN task.id = $1 THEN (SELECT position FROM task WHERE task.id = $2)
          WHEN task.id = $2 THEN (SELECT position FROM task WHERE task.id = $1)
      END
      WHERE task.id IN ($1, $2);
    `;

    await this.dataSource.query(query, [id, swipeTaskId]);
  }
}

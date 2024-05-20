import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { Repository } from 'typeorm';
import { SectionService } from 'src/section/section.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Section } from 'src/section/entity/section.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { ProjectService } from 'src/project/project.service';
import { UserService } from 'src/user/user.service';
import { ChangeUsersDto } from './dto/change-users.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly userService: UserService,
    private readonly sectionService: SectionService,
    private readonly projectService: ProjectService,

    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async findAll(): Promise<Task[]> {
    return await this.taskRepository.find();
  }

  async findOne(id: number): Promise<Task> {
    return await this.taskRepository.findOne({ where: { id: id } });
  }

  async findOneWithInformation(id: number): Promise<Task> {
    return await this.taskRepository.findOne({
      where: { id: id },
      relations: {
        users: true,
        taskLogs: {
          taskLogType: true,
          user: true,
        },
      },
    });
  }

  async findBySectionId(sectionId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: {
        section: await this.sectionService.findOne(sectionId),
      },
    });
  }

  async findArchivedByProjectId(projectId: number): Promise<Task[]> {
    return await this.taskRepository.find({
      where: {
        project: await this.projectService.findOne(projectId),
        inArchive: true,
      },
    });
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task[]> {
    const newTask = await this.taskRepository.create(createTaskDto);
    newTask.section = await this.sectionService.findOne(
      createTaskDto.sectionId,
    );

    await this.taskRepository.save(newTask);
    return await this.taskRepository.find({
      where: { section: newTask.section },
    });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: id } });
    task.name = updateTaskDto.name;
    return await this.taskRepository.save(task);
  }

  async updatePriority(
    id: number,
    updatePriorityDto: UpdatePriorityDto,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id: id } });
    task.priority = updatePriorityDto.priority;
    return await this.taskRepository.save(task);
  }

  async updatePosition(
    id: number,
    newPosition: number,
    sectionId: number,
  ): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { section: { id: sectionId } },
      order: { position: 'ASC' },
      relations: { users: true },
    });

    const taskIndex = tasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    const [task] = tasks.splice(taskIndex, 1);
    tasks.splice(newPosition, 0, task);

    tasks.forEach((task, index) => {
      task.position = index;
    });

    await this.taskRepository.save(tasks);
    return tasks;
  }

  async updatePositionAndSection(
    id: number,
    newPosition: number,
    newSectionId: number,
  ): Promise<Task[]> {
    const taskToUpdate = await this.taskRepository.findOne({
      where: { id: id },
      relations: { section: true, users: true },
    });

    const oldTasks = await this.taskRepository.find({
      where: { section: { id: taskToUpdate.section.id } },
      order: { position: 'ASC' },
      relations: { users: true },
    });

    const oldIndex = oldTasks.findIndex((task) => task.id === id);
    if (oldIndex !== -1) {
      oldTasks.splice(oldIndex, 1);
    }

    oldTasks.forEach((task, index) => {
      task.position = index;
    });

    const newTasks = await this.taskRepository.find({
      where: { section: { id: newSectionId } },
      order: { position: 'ASC' },
      relations: { users: true },
    });

    newTasks.splice(newPosition, 0, taskToUpdate);
    taskToUpdate.section = { id: newSectionId } as Section;

    newTasks.forEach((task, index) => {
      task.position = index;
    });

    await this.taskRepository.save([...oldTasks, ...newTasks]);
    return newTasks;
  }

  async changeUsers(id: number, changeUsersDto: ChangeUsersDto): Promise<Task> {
    const task: Task = await this.taskRepository.findOne({
      where: { id: id },
      relations: { users: true },
    });
    task.users = task.users.filter((user) =>
      changeUsersDto.users.some((changedUserId) => user.id === changedUserId),
    );
    changeUsersDto.users.map(async (changedUserId) => {
      if (!task.users.some((user) => user.id === changedUserId))
        task.users.push(await this.userService.findOne(changedUserId));
    });
    return await this.taskRepository.save(task);
  }

  async setArchive(id: number): Promise<Task[]> {
    const taskToArchive = await this.taskRepository.findOne({
      where: { id: id },
      relations: { section: true, users: true },
    });

    const tasks = await this.taskRepository.find({
      where: { section: { id: taskToArchive.section.id } },
      order: { position: 'ASC' },
      relations: { users: true },
    });

    const oldIndex = tasks.findIndex((task) => task.id === taskToArchive.id);
    if (oldIndex !== -1) {
      tasks.splice(oldIndex, 1);
    }

    tasks.forEach((task, index) => {
      task.position = index;
    });

    taskToArchive.inArchive = true;
    taskToArchive.position = null;
    taskToArchive.section = null;

    await this.taskRepository.save([...tasks, taskToArchive]);
    return tasks;
  }

  async delete(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }
}

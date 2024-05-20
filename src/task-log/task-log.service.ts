import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskLog } from './entities/task-log.entity';
import { TaskService } from 'src/task/task.service';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { TaskLogType } from './entities/task-log-type.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskLogService {
  constructor(
    private readonly taskService: TaskService,
    private readonly userService: UserService,

    @InjectRepository(TaskLog)
    private taskLogRepository: Repository<TaskLog>,

    @InjectRepository(TaskLogType)
    private taskLogTypeRepository: Repository<TaskLogType>,
  ) {}

  async create(createTaskLogDto: CreateTaskLogDto): Promise<TaskLog> {
    const taskLog: TaskLog = new TaskLog();
    taskLog.text = createTaskLogDto.text;
    taskLog.taskLogType = await this.taskLogTypeRepository.findOne({
      where: { id: createTaskLogDto.taskLogTypeId },
    });
    taskLog.task = await this.taskService.findOne(createTaskLogDto.taskId);
    taskLog.user = await this.userService.findOne(createTaskLogDto.userId);
    return await this.taskLogRepository.save(taskLog);
  }
}

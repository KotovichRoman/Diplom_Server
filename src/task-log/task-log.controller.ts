import { Body, Controller, Post } from '@nestjs/common';
import { TaskLogService } from './task-log.service';
import { CreateTaskLogDto } from './dto/create-task-log.dto';
import { TaskLog } from './entities/task-log.entity';

@Controller('/task-log')
export class TaskLogController {
  constructor(private readonly taskLogService: TaskLogService) {}

  @Post('/')
  async create(@Body() createTaskLogDto: CreateTaskLogDto): Promise<TaskLog> {
    return await this.taskLogService.create(createTaskLogDto);
  }
}

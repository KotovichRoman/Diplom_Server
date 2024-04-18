import { Controller, Param, Get, Put, Query, Post, Body } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/section/:sectionId')
  async findBySectionId(
    @Param('sectionId') sectionId: number,
  ): Promise<Task[]> {
    return await this.taskService.findBySectionId(sectionId);
  }

  @Post('/')
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskService.create(createTaskDto);
  }

  @Put('/:id/section')
  async updateSectionId(
    @Param('id') id: number,
    @Query('sectionId') sectionId: number,
  ): Promise<void> {
    return await this.taskService.updateSectionId(id, sectionId);
  }

  @Put('/:id/position')
  async updatePosition(
    @Param('id') id: number,
    @Query('swipeTaskId') swipeTaskId: number,
  ): Promise<void> {
    return await this.taskService.updatePosition(id, swipeTaskId);
  }
}

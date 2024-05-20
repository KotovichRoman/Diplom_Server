import {
  Controller,
  Param,
  Get,
  Put,
  Query,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdatePriorityDto } from './dto/update-priority.dto';
import { ChangeUsersDto } from './dto/change-users.dto';

@Controller('/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Task> {
    return await this.taskService.findOneWithInformation(id);
  }

  @Get('/section/:sectionId')
  async findBySectionId(
    @Param('sectionId') sectionId: number,
  ): Promise<Task[]> {
    return await this.taskService.findBySectionId(sectionId);
  }

  @Get('/archive/')
  async findArchiveByProjectId(
    @Param('projectId') projectId: number,
  ): Promise<Task[]> {
    return await this.taskService.findArchivedByProjectId(projectId);
  }

  @Post('/')
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task[]> {
    return await this.taskService.create(createTaskDto);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return await this.taskService.update(id, updateTaskDto);
  }

  @Put('/:id/priority')
  async updatePriority(
    @Param('id') id: number,
    @Body() updatePriorityDto: UpdatePriorityDto,
  ): Promise<Task> {
    return await this.taskService.updatePriority(id, updatePriorityDto);
  }

  @Put('/:id/position')
  async updatePosition(
    @Param('id') id: number,
    @Query('newPosition') newPosition: number,
    @Query('sectionId') sectionId: number,
  ): Promise<Task[]> {
    return await this.taskService.updatePosition(
      Number(id),
      newPosition,
      sectionId,
    );
  }

  @Put('/:id/section')
  async updateSection(
    @Param('id') id: number,
    @Query('newPosition') newPosition: number,
    @Query('sectionId') sectionId: number,
  ): Promise<Task[]> {
    return await this.taskService.updatePositionAndSection(
      Number(id),
      newPosition,
      sectionId,
    );
  }

  @Delete('/:id/users')
  async deposedUser(
    @Param('id') id: number,
    @Body() changeUsersDto: ChangeUsersDto,
  ): Promise<Task> {
    return await this.taskService.changeUsers(Number(id), changeUsersDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.taskService.delete(id);
  }

  @Delete('/:id/archive')
  async setArchive(@Param('id') id: number): Promise<Task[]> {
    return await this.taskService.setArchive(id);
  }
}

import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './entity/project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('')
  async findByUserId(@Query('userId') userId: number): Promise<Project[]> {
    return await this.projectService.findByUserId(userId);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Project> {
    return await this.projectService.findOneWithInformation(id);
  }
}

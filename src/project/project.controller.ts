import { Controller, Get, Param } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './entity/project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Project> {
    return await this.projectService.findOneWithInformation(id);
  }
}

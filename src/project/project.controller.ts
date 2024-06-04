import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './entity/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('/project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/')
  async findByUserId(@Query('userId') userId: number): Promise<Project[]> {
    return await this.projectService.findByUserId(userId);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number): Promise<Project> {
    return await this.projectService.findOneWithInformation(id);
  }

  @Post('/')
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    return await this.projectService.create(createProjectDto);
  }
}

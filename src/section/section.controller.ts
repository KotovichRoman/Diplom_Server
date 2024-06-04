import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { Section } from './entity/section.entity';
import { UpdateSectionDto } from './dto/update-section.dto';

@Controller('/section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Get('/')
  async findByUserId(
    @Query('userId') userId: number,
    @Query('projectId') projectId: number,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
  ): Promise<Section[]> {
    return await this.sectionService.findWithFilters(
      projectId,
      Number(userId),
      priority,
      search,
    );
  }

  @Post('/')
  async create(@Body() createSectionDto: CreateSectionDto): Promise<Section> {
    return await this.sectionService.create(createSectionDto);
  }

  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Body() updateSectionDto: UpdateSectionDto,
  ): Promise<Section> {
    return await this.sectionService.update(id, updateSectionDto);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this.sectionService.delete(id);
  }
}

import { Body, Controller, Post } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { Section } from './entity/section.entity';

@Controller('/section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post('/')
  async create(@Body() createSectionDto: CreateSectionDto): Promise<Section> {
    return await this.sectionService.create(createSectionDto);
  }
}

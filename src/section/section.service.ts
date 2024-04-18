import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Section } from './entity/section.entity';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class SectionService {
  constructor(
    private readonly projectService: ProjectService,

    @InjectRepository(Section)
    private sectionRepository: Repository<Section>,
  ) {}

  async findAll(): Promise<Section[]> {
    return await this.sectionRepository.find();
  }

  async findOne(id: number): Promise<Section> {
    return await this.sectionRepository.findOne({ where: { id: id } });
  }

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const newSection: Section =
      await this.sectionRepository.create(createSectionDto);
    newSection.project = await this.projectService.findOne(
      createSectionDto.projectId,
    );
    return await this.sectionRepository.save(newSection);
  }
}

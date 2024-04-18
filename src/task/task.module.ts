import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { SectionService } from 'src/section/section.service';
import { Section } from 'src/section/entity/section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Section])],
  providers: [TaskService, SectionService],
  controllers: [TaskController],
})
export class TaskModule {}

import { Global, Module } from '@nestjs/common';
import { TaskLogService } from './task-log.service';
import { TaskLogController } from './task-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLogType } from './entities/task-log-type.entity';
import { TaskLog } from './entities/task-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TaskLog, TaskLogType])],
  providers: [TaskLogService],
  controllers: [TaskLogController],
  exports: [TaskLogService],
})
export class TaskLogModule {}

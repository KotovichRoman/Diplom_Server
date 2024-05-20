import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TaskLogType } from './task-log-type.entity';
import { Task } from 'src/task/entity/task.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class TaskLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(() => Task, (task) => task.taskLogs)
  task: Task;

  @ManyToOne(() => User, (user) => user.taskLogs)
  user: User;

  @ManyToOne(() => TaskLogType, (taskLogType) => taskLogType.taskLogs)
  taskLogType: TaskLogType;
}

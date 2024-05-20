import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { TaskLog } from './task-log.entity';

@Entity()
export class TaskLogType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => TaskLog, (taskLog) => taskLog.taskLogType)
  taskLogs: TaskLog[];
}

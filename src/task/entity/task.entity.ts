import { Project } from 'src/project/entity/project.entity';
import { Section } from 'src/section/entity/section.entity';
import { TaskLog } from 'src/task-log/entities/task-log.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  priority: string;

  @Column({ nullable: true })
  position: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  startedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  plannedEndedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  factedEndedAt: Date;

  @Column({ default: true })
  inArchive: boolean = false;

  @OneToMany(() => TaskLog, (taskLog) => taskLog.user)
  taskLogs: TaskLog[];

  @ManyToOne(() => Section, (section) => section.tasks)
  section: Section;

  @ManyToOne(() => Project, (project) => project.tasks)
  project: Project;

  @ManyToMany(() => User, (user) => user.tasks)
  @JoinTable({ name: 'task_users' })
  users: User[];
}

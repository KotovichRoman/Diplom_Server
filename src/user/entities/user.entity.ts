import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './role.entity';
import { Message } from 'src/message/entities/message.entity';
import { ChatUsers } from 'src/chat-users/entities/chat-users.entity';
import { Project } from 'src/project/entity/project.entity';
import { Task } from 'src/task/entity/task.entity';
import { TaskLog } from 'src/task-log/entities/task-log.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  patronymic: string;

  @Column({ default: true })
  isDeactivated: boolean = true;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  @OneToMany(() => ChatUsers, (chatUsers) => chatUsers.user, {
    cascade: true,
  })
  chatUsers: ChatUsers[];

  @OneToMany(() => TaskLog, (taskLog) => taskLog.task)
  taskLogs: TaskLog[];

  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable({ name: 'project_users' })
  projects: Project[];

  @ManyToMany(() => Task, (task) => task.users)
  tasks: Task[];
}

import { Section } from 'src/section/entity/section.entity';
import { Task } from 'src/task/entity/task.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  startedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  endedAt: Date;

  @OneToMany(() => Section, (section) => section.project)
  sections: Section[];

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @ManyToMany(() => User, (user) => user.projects)
  users: User[];
}

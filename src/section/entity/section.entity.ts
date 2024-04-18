import { Project } from 'src/project/entity/project.entity';
import { Task } from 'src/task/entity/task.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Section {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Task, (task) => task.section)
  tasks: Task[];

  @ManyToOne(() => Project, (project) => project.sections)
  project: Project;
}

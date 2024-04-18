import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { MessageType } from './message-type.entity';
import { Chat } from 'src/chat/entities/chat.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column({ nullable: false, default: true })
  isRead: boolean = false;

  @ManyToOne(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => Chat, { nullable: true })
  chat: Chat;

  @ManyToOne(() => MessageType, { nullable: true })
  messageType: MessageType;
}

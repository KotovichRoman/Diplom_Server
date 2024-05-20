import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  ManyToOne,
  JoinColumn,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChatUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'userId', nullable: true })
  userId: number;

  @Column({ name: 'chatId', nullable: true })
  chatId: number;

  @Column({ default: true })
  isOwner: boolean = false;

  @ManyToOne(() => User, (user) => user.chatUsers)
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.chatUsers)
  @JoinColumn([{ name: 'chatId', referencedColumnName: 'id' }])
  chat: Chat;
}

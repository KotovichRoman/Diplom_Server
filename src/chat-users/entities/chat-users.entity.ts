import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isOwner: boolean = false;

  @ManyToOne(() => User, (user) => user.chatUsers)
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.chatUsers)
  chat: Chat;
}

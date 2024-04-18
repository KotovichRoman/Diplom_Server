import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn, Column } from 'typeorm';

@Entity()
export class ChatUsers {
  @PrimaryColumn({ name: 'userId' })
  userId: number;

  @PrimaryColumn({ name: 'chatId' })
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

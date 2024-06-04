import { ChatUsers } from 'src/chat-users/entities/chat-users.entity';
import { Message } from 'src/message/entities/message.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  solo: boolean = false;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];

  @OneToMany(() => ChatUsers, (chatUsers) => chatUsers.user)
  chatUsers: ChatUsers[];
}

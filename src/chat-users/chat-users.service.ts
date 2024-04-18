import { Injectable } from '@nestjs/common';
import { ChatUsers } from './entities/chat-users.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { Chat } from 'src/chat/entities/chat.entity';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class ChatUsersService {
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,

    @InjectRepository(ChatUsers)
    private chatUsersRepository: Repository<ChatUsers>,
  ) {}

  async findUsersByChatId(chatId: number): Promise<ChatUsers[]> {
    return await this.chatUsersRepository.find({ where: { chatId: chatId } });
  }

  async create(usersId: number[], chatId: number): Promise<void> {
    const users: User[] = await this.userService.findAllByIds(usersId);
    const chat: Chat = await this.chatService.findOne(chatId);
    const chatUsers: ChatUsers = new ChatUsers();
    chatUsers.chat = chat;
    users.map(async (user) => {
      chatUsers.user = user;
      await this.chatUsersRepository.save(chatUsers);
    });
  }
}

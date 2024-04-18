import { Injectable } from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly userService: UserService,

    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
  ) {}

  async findByUserId(userId: number): Promise<Chat[]> {
    return await this.chatRepository.query(`
      SELECT c.id, c.name, m.description as lastMessage, u.name as userName
      FROM chat as c
      JOIN message as m ON m.id = (
          SELECT m2.id
          FROM message as m2
          WHERE m2."chatId" = c.id
          ORDER BY m2."createdAt" DESC
          LIMIT 1
      )
      join chat_users as cu on cu."chatId" = c.id
      join public.user as u on u.id = cu."userId"
      where u.id = ${userId}
    `);
  }

  async findOne(id: number): Promise<Chat> {
    return await this.chatRepository.findOne({ where: { id: id } });
  }

  async create(createChatDto: CreateChatDto): Promise<Chat> {
    const chat: Chat = new Chat();
    chat.name = createChatDto.name;
    await this.chatRepository.save(chat);

    if (chat.chatUsers == null) {
      chat.chatUsers = [];
    }

    return chat;
  }
}

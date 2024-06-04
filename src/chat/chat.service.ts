import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Chat } from './entities/chat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,

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

  async create(ownerId: number, createChatDto: CreateChatDto): Promise<Chat> {
    const newChat: Chat = new Chat();
    newChat.name = createChatDto.name;
    await this.chatRepository.save(newChat);

    const createMessageDto: CreateMessageDto = new CreateMessageDto();
    createMessageDto.chatId = newChat.id;
    createMessageDto.messageTypeId = 2;
    createMessageDto.userId = ownerId;
    createMessageDto.description = 'Chat created';
    await this.messageService.create(createMessageDto);

    return newChat;
  }

  async doesSoloChatExist(createChatDto: CreateChatDto): Promise<Chat> {
    const chat: Chat = await this.chatRepository.query(`
      SELECT chat.id, chatUser1."userId" as userId1, chatUser2."userId" as userId2
      FROM chat
      INNER JOIN chat_users AS chatUser1 ON chatUser1."chatId" = chat.id AND chatUser1."userId" = ${createChatDto.users[0]}
      INNER JOIN chat_users AS chatUser2 ON chatUser2."chatId" = chat.id AND chatUser2."userId" = ${createChatDto.users[1]}
      WHERE chat.solo = TRUE
    `);

    return chat;
  }
}

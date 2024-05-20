import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageType } from './entities/message-type.entity';
import { ChatService } from 'src/chat/chat.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UserService,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(MessageType)
    private messageTypeRepository: Repository<MessageType>,
  ) {}

  async findByChatId(chatId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      relations: ['chat', 'user'],
      where: {
        chat: {
          id: chatId,
        },
      },
    });
  }

  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const message: Message =
      await this.messageRepository.create(createMessageDto);
    message.chat = await this.chatService.findOne(createMessageDto.chatId);
    message.user = await this.userService.findOne(createMessageDto.userId);
    message.messageType = await this.messageTypeRepository.findOne({
      where: { id: createMessageDto.messageTypeId },
    });
    return await this.messageRepository.save(message);
  }
}

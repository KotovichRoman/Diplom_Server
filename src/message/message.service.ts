import { Inject, Injectable, forwardRef } from '@nestjs/common';
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
    private readonly userService: UserService,

    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(MessageType)
    private messageTypeRepository: Repository<MessageType>,
  ) {}

  async findByChatId(chatId: number): Promise<Message[]> {
    return await this.messageRepository.find({
      relations: ['chat', 'user', 'messageType'],
      where: {
        chat: {
          id: chatId,
        },
      },
    });
  }

  async findOneTypeByName(name: string): Promise<MessageType> {
    return await this.messageTypeRepository.findOne({ where: { name: name } });
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

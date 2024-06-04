import { Global, Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatUsersService } from 'src/chat-users/chat-users.service';
import { ChatUsers } from 'src/chat-users/entities/chat-users.entity';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';
import { ChatService } from './chat.service';

@Global()
@Injectable()
@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private clients = new Map<number, Socket>();

  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
    private readonly chatUsersService: ChatUsersService,
  ) {}

  handleConnection(client: Socket) {
    const userId = parseInt(client.handshake.query.userId as string);
    if (!isNaN(userId)) {
      this.clients.set(userId, client);
      console.log(`Client connected: ${client.id} with userId: ${userId}`);
    } else {
      client.disconnect(true);
      console.log(`Disconnected ${client.id}: Invalid userId`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = parseInt(client.handshake.query.userId as string);
    this.clients.delete(userId);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('chats')
  async handleChats(senderClient: Socket): Promise<void> {
    const userId = parseInt(senderClient.handshake.query.userId as string);
    const chats: Chat[] = await this.chatService.findByUserId(userId);
    senderClient.emit('onChats', chats);
  }

  @SubscribeMessage('chatMessages')
  async handleChatMessages(senderClient: Socket, payload: any): Promise<void> {
    const messages: Message[] = await this.messageService.findByChatId(
      payload.chatId,
    );
    senderClient.emit('onChatMessages', messages);
  }

  @SubscribeMessage('createMessage')
  async handleCreateMessage(
    senderClient: Socket,
    payload: CreateMessageDto,
  ): Promise<void> {
    const users: ChatUsers[] = await this.chatUsersService.findUsersByChatId(
      payload.chatId,
    );
    const message: Message = await this.messageService.create(payload);
    users.map(async (user) => {
      try {
        console.log(user);
        const clientForSend: Socket = this.clients.get(user.user.id);
        if (clientForSend != null) {
          clientForSend.emit('onCreateMessage', message);
        }
      } catch (err) {
        console.log(err);
        console.log('no receiver connected...');
      }
    });
  }

  @SubscribeMessage('createChat')
  async handleCreateChat(
    senderClient: Socket,
    payload: CreateChatDto,
  ): Promise<void> {
    const userId = parseInt(senderClient.handshake.query.userId as string);
    const chat: Chat = await this.chatService.create(userId, payload);
    await this.chatUsersService.create(payload.users, chat.id);
    payload.users.map(async (user) => {
      try {
        const clientForSend: Socket = this.clients.get(user);
        if (clientForSend != null) {
          clientForSend.emit('onCreateChat', chat);
        }
      } catch (err) {
        console.log(err);
        console.log('no receiver connected...');
      }
    });
  }

  @SubscribeMessage('checkSoloChat')
  async handleCheckSoloChat(
    senderClient: Socket,
    payload: CreateChatDto,
  ): Promise<void> {
    const exists = await this.chatService.doesSoloChatExist(payload);
    senderClient.emit('onCkeckSoloChat', exists);
  }
}

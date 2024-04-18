import { Global, Module } from '@nestjs/common';
import { ChatUsersService } from './chat-users.service';
import { ChatUsersController } from './chat-users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatUsers } from './entities/chat-users.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ChatUsers])],
  providers: [ChatUsersService],
  controllers: [ChatUsersController],
  exports: [ChatUsersService],
})
export class ChatUsersModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { SectionModule } from './section/section.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { ChatUsersModule } from './chat-users/chat-users.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: `${process.env.POSTGRES_USER}`,
      password: `${process.env.POSTGRES_PASSWORD}`,
      database: 'crm',
      schema: `${process.env.POSTGRES_SCHEMA}`,
      autoLoadEntities: true,
      synchronize: true,
      migrations: ['../migration/*{.ts,.js}'],
    }),
    TaskModule,
    SectionModule,
    ProjectModule,
    UserModule,
    ChatModule,
    ChatUsersModule,
    MessageModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

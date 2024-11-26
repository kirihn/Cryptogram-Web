import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma.servise';
import { ChatGateway } from './chat.gateway';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
    controllers: [ChatController],
    providers: [
        ChatService,
        PrismaService,
        ChatGateway,
        JwtService,
        ConfigService,
    ],
})
export class ChatModule {}

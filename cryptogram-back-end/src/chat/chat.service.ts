import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { CreateChatDto } from './dto/createChat.dto';
import { PrismaService } from 'src/prisma.servise';
import { AddMemberDto } from './dto/addMember.dto';

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}
    async Create(dto: CreateChatDto, userId: string) {
        const chat = await this.prisma.$transaction(async (prisma) => {
            const chat = await prisma.chats.create({
                data: {
                    ChatName: dto.chatName,
                    IsGroup: dto.isGroup,
                    KeyHash: dto.keyHash,
                },
            });

            await prisma.chatMembers.create({
                data: {
                    UserId: userId,
                    ChatId: chat.ChatId,
                    Role: 1,
                },
            });

            return chat;
        });

        return chat;
    }

    async AddMember(dto: AddMemberDto, userId: string) {
        await this.ValidateAddMember(dto, userId);

        const NewMember = await this.prisma.chatMembers.create({
            data: {
                ChatId: dto.chatId,
                UserId: dto.userId,
                Role: dto.role,
            },
        });
        return NewMember;
    }

    findOne(id: number) {
        return `This action returns a #${id} chat`;
    }

    remove(id: number) {
        return `This action removes a #${id} chat`;
    }

    async ValidateAddMember(dto: AddMemberDto, userId: string) {
        const member = await this.prisma.chatMembers.findFirst({
            where: {
                UserId: userId,
                ChatId: dto.chatId,
            },
            select: {
                Role: true,
            },
        });

        if (member.Role > dto.role)
            throw new ForbiddenException({
                error: true,
                message: 'You cannot grant roles larger than yours',
            });

        const isNewMember = await this.prisma.chatMembers.findFirst({
            where: {
                ChatId: dto.chatId,
                UserId: dto.userId,
            },
        });

        if (isNewMember)
            throw new BadRequestException({
                error: true,
                message: 'This user is already a member of the chat',
            });

        const isNewMemberExist = await this.prisma.users.findUnique({
            where: {
                UserId: dto.userId,
            },
        });

        if (!isNewMemberExist)
            throw new ForbiddenException({
                error: true,
                message: 'This user does not exist',
            });
    }
}

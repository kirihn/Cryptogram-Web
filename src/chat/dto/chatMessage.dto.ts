import {
    IsIn,
    IsInt,
    IsNotEmpty,
    IsPositive,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class ChatMessage {
    MessageId: number;
    Content: string;
    MessageType: string;
    IsUpdate: boolean;
    IsRead: boolean;
    CreatedAt: any;
    SenderId: string;
}

export class NewMessageDto {
    @IsString()
    @MinLength(1, {
        message: 'message must be 1 least characters long',
    })
    @MaxLength(499, {
        message: 'message must be 499 least characters short',
    })
    content: string;

    @IsString()
    @IsIn(['msg', 'sticker'], {
        message: 'The message type must be a msd or sticker',
    })
    messageType: string;

    @IsInt()
    @IsNotEmpty({ message: 'The chatId must not be empty' })
    @IsPositive()
    chatId: number;
}

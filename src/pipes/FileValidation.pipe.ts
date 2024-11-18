import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
    private readonly maxFileSize: number;
    private readonly allowedFormats: RegExp;

    constructor(maxFileSizeKb: number, allowedFormats: RegExp) {
        this.maxFileSize = maxFileSizeKb * 1000; // Перевод размера в байты
        this.allowedFormats = allowedFormats;
    }

    transform(value: any, metadata: ArgumentMetadata) {
        if (!value || typeof value.size !== 'number' || !value.originalname) {
            throw new BadRequestException('Файл не найден или имеет некорректный формат.');
        }

        if (value.size > this.maxFileSize) {
            throw new BadRequestException(
                `Размер файла превышает допустимый лимит ${this.maxFileSize / 1000}KB.`,
            );
        }

        if (!this.allowedFormats.test(value.originalname)) {
            throw new BadRequestException(
                `Файл должен быть одного из следующих форматов: ${this.allowedFormats}`,
            );
        }

        return value;
    }
}

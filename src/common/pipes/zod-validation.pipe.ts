import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema?: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    const schema = this.schema || (metadata.metatype as any)?.schema;
    if (schema) {
      const result = schema.safeParse(value);
      if (!result.success) {
        throw new BadRequestException(result.error.issues);
      }
      return result.data;
    }
    return value;
  }
}

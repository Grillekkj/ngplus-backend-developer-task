import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error?.property ?? 'unknown',
          messages: error?.constraints
            ? Object.values(error.constraints)
            : ['Validation error'],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(configService.get<number>('SERVER_PORT') ?? 3000);
}
void bootstrap();

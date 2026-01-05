import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';
import chalk from 'chalk';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  const port = configService.get<number>('PORT')!;
  const host = configService.get<string>('HOST')!;

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // faqat DTO maydonlarini qabul qiladi
    forbidNonWhitelisted: true, // qo‘shimcha maydon bo‘lsa xato beradi
    transform: true,       // string → number yoki boolean ga avtomatik o‘tkazadi
  }));
  
  app.setGlobalPrefix('api/v1');
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Tezamart API Hujjatlari')
  .setDescription('Tezamart ilovasining RESTful API hujjatlari')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, documentFactory());


  app.enableCors({
    origin: '*',
  });


  try {
    await app.listen(port || 3000, host || '*');
    Logger.log(
      chalk.blueBright('------------------------------------------------'),
    );
    Logger.log(
      `${chalk.greenBright('[🚀 Server Boshladi]')}  Server quyidagi manzilda ishlamoqda: ${chalk.bgBlue.black(` http://${host}:${port}/api/v1`)}`,
    );
    Logger.log(
      `${chalk.cyan('[📚 Swagger Hujjatlari]')}  Ushbu manzilda mavjud: ${chalk.bgMagenta.white(` http://${host}:${port}/api/v1/docs `)}`,
    );
    Logger.log(
      `${chalk.yellow('[✅ Serverni To‘xtatish]')}  Serverni to'xtatish uchun ${chalk.bgRed.white(' CTRL+C ')} tugmalarini bosing`,
    );
    Logger.log(
      chalk.blueBright('------------------------------------------------'),
    );
  } catch (error) {
    Logger.error(`${chalk.red('[🚨 Error]:')} ${chalk.white(error.message)}`);
  }
}
bootstrap();

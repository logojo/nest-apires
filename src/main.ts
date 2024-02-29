import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()

  //Validaciones de datos en campos enviados desde el backend
  //usando la libreria npm i class-validator class-transformer
  app.useGlobalPipes( 
    new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true, 
    }) 
   );


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

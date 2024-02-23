import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './entities/user.entity';


@Module({
  //Aqui se importan todos los modelos permitidos en este Modulo
  controllers: [AuthController],
  imports:[
    ConfigModule.forRoot(), // Este modulo me permite utilizar las variables de entorno
    MongooseModule.forFeature([
      { 
        name: User.name, 
        schema: UserSchema 
      }
    ]),
    //Importando modulo para cifrar token con jwt
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SEED,
      signOptions: { expiresIn: '1h' },
    }),
  ], 
  providers: [AuthService],
})
export class AuthModule {}

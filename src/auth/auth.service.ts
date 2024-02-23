import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcryptjs  from 'bcryptjs'

import { CreateUserDto, UpdateUserDto, LoginDto, SignUpDto } from './dto';

import { User } from './entities/user.entity';
import { Jwtpayload, LoginResponse } from './interfaces';



@Injectable()
export class AuthService {

  //Injectando el modelo en el servicio
  constructor (  @InjectModel( User.name ) private userModel : Model<User>,
                 private jwtService: JwtService
              ) { }

  async create(CreateUserDto: CreateUserDto) : Promise<User> {

    try {
      const { password, ...userData } = CreateUserDto;

      //Creando una nueva instancia del modelo User tomando los valores del desestructurados del CreateUserDto( json del backend )
      const user = new this.userModel(
        {
          password: bcryptjs.hashSync( password, 10), //Encriptando contraseña usando paquete bcryptjs
          ...userData
        }
      );

     await user.save(); //guardando

     //Excluyendo el password de la respuesta el _ es para que no choque con la otra variable ya definida
     const { password:_, ...usuario } = user.toJSON()

     return usuario

    } catch (error) {
      console.log(error.code);
      if( error.code === 11000 ){
        throw new BadRequestException(`${ CreateUserDto.email } was taken`)
      }

      throw new InternalServerErrorException('Something was wrong!!!')
    }
  
  }

  //registrarse
  //En esta función se manda llamar la funcion create ya creada pero con diferentes parametros que vienen desde el back
  async signUp(SignUpDto: SignUpDto) : Promise<LoginResponse> {   
    const user = await this.create( SignUpDto )
  
    return{
      user,
      token: this.getJWT({id: user._id, email: user.email})
    }
  }

  async login(LoginDto: LoginDto) :Promise<LoginResponse>{
   const { email, password } = LoginDto;

   //buscando usuario
   const user =  await this.userModel.findOne({email})

    if( !user ) {
      throw new UnauthorizedException('Credential are not valid ')
    }

    //validando contraseña
    if( !bcryptjs.compareSync( password, user.password )) {
      throw new UnauthorizedException('Credential are not valid ')
    }

    const { password:_, ...usuario } = user.toJSON()

    return {
      user: usuario,
      token: this.getJWT({id: user.id, email: user.email}),
    }
  }

  findAll() : Promise<User[]> {
   return this.userModel.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, UpdateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJWT( payload : Jwtpayload ){
    const token =  this.jwtService.sign( payload );
    return token
  }
}

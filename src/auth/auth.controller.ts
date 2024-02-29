import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto, LoginDto, SignUpDto } from './dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  /* ----- FUNCIONES DEL AUTH ------ */

  //Al crear la funcion automaticamente se crea el endpoint solo hay que pasar como parametro el nombre de la ruta
  //Las rutas del crud se crean automaticamente con la creación de un resourse
  //en el controlador se crean las rutas y se mandan llamar las funciones del servicio
  @Post('/login')
  login(@Body() LoginDto: LoginDto){
    return this.authService.login(LoginDto);
  }

  @Post('/sign-up')
  signUp(@Body() SignUpDto: SignUpDto){
    return this.authService.signUp(SignUpDto);
  }

  @UseGuards( AuthGuard )
  @Get('/refresh')
  refresh(@Request() req: Request ) : LoginResponse {
    const user = req['user'] as User

    return {
      user,
      token: this.authService.getJWT({id: user._id, email: user.email})
    }
  }

  
  /* ----- FUNCIONES DEL AUTH ------ */
  

  //Las funciones Dto son usadas para recibir los datos en Json del formulario del frontend
  @Post()
  create(@Body() CreateUserDto: CreateUserDto) {
    return this.authService.create(CreateUserDto);
  }

  @UseGuards( AuthGuard )
  @Get()
  findAll(@Request() req: Request) {
    return this.authService.findAll();
  }

  //Usando el guard en la ruta para protejerla
  @UseGuards( AuthGuard )
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto) {
    return this.authService.update(+id, UpdateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

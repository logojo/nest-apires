//En esta función se hacen las validaciones de los datos que vendran en Json del fronend

import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    //Utilizando los decoradores de Class Validator
    @IsEmail()
    email    : string;

    @IsString()
    name     : string;

    @MinLength(6)
    password : string;
}

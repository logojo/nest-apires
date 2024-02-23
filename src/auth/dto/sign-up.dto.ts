
import { IsEmail, IsString, MinLength, ArrayNotEmpty, IsArray, ArrayMinSize } from "class-validator";


export class SignUpDto {

    //Utilizando los decoradores de Class Validator
    @IsEmail()
    email    : string;

    @IsString()
    name     : string;

    @MinLength(6)
    password : string;

   @IsArray()
   @ArrayMinSize(1)
   roles    : string[];
}

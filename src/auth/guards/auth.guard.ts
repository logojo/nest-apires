import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Jwtpayload } from '../interfaces';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor( private jwtService: JwtService,
               private authService : AuthService
             ) {}


  //El context nos da a acceso a toda la peticion que se esta realizando
  async canActivate( context: ExecutionContext ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
   
    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    }

    try {
      const payload = await this.jwtService.verifyAsync<Jwtpayload>(
        token, 
        { secret: process.env.JWT_SEED }
      );

      const user = await this.authService.findOne( payload.id )
      if( !user ) throw new UnauthorizedException("User don't exist.")
      if( !user.isActive ) throw new UnauthorizedException("User isn't active.")

      request['user'] = user;

    } catch(e) {
      throw new UnauthorizedException(e.response);
    }
   
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

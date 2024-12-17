import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(private jwtService: JwtService) {

    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization
        if (!token) {
            throw new UnauthorizedException('No está autorizado')
        };

        const jwt = token.split(" ")[1];

        try {
            const payload = await this.jwtService.verifyAsync(
                jwt, {
                secret: 'jsonwebtoken'
            }
            );
            request['USUARIO'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;

    }
}
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { RoleEnum } from "../enum/role.enum";
import { Reflector } from "@nestjs/core";
import { CLAVE_ROLES } from "src/decorator/roles.decorator";

@Injectable()
export class ValidarRoles implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const rolUsuarioAutenticado = request['USUARIO'].rol;
        /* if (rolUsuarioAutenticado !== RoleEnum.ADMIN) {
            throw new UnauthorizedException('Usuario no autorizado')
        } */
        //información del decorador
        const requeridos = this.reflector.getAllAndOverride<RoleEnum[]>(CLAVE_ROLES, [context.getHandler(), context.getClass()]);

        const encontrados = requeridos.find(rol => rol === rolUsuarioAutenticado);
        if (!encontrados) {
            return false
        }
        return true;

    }
}
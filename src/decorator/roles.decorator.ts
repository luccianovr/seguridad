import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "src/usuario/enum/role.enum";

export const CLAVE_ROLES = 'CLAVE_ROLES_PARA_ROLES_PERMITIDOS';
export const RolesPermitidos = (...params: RoleEnum[]) => SetMetadata(CLAVE_ROLES, params);
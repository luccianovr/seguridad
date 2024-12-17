import { ApiProperty } from "@nestjs/swagger"
import { RoleEnum } from "../enum/role.enum"
import { IsEnum } from "class-validator"

export class CreateUsuarioDto {

    @ApiProperty({ example: 'lucvil' })
    username: string

    @ApiProperty({ example: 'luc@gmail.com' })
    email: string

    @ApiProperty({ example: 'clave123' })
    password_hash: string

    @ApiProperty({ enum: RoleEnum })
    @IsEnum(RoleEnum, { message: 'Debe ser del tipo Usuario' })
    role: RoleEnum.USUARIO

}

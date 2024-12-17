import { ApiProperty } from "@nestjs/swagger"
import { RoleEnum } from "../enum/role.enum"
import { IsEnum } from "class-validator"

export class getUsuarioDto {

    @ApiProperty({ example: 'lucvil' })
    username: string

    @ApiProperty({ example: 'luc@gmail.com' })
    email: string

    @ApiProperty({ enum: RoleEnum })
    @IsEnum(RoleEnum, { message: 'Debe ser del tipo Usuario' })
    role: RoleEnum.USUARIO

}

import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum } from "../enum/role.enum";
import { IsEnum } from "class-validator";

export class UpdateRol {
    @ApiProperty({ description: 'username del usuario' })
    username: string;

    @ApiProperty({ enum: RoleEnum })
    @IsEnum(RoleEnum, { message: 'Debe ser del tipo Usuario' })
    role: RoleEnum;
}

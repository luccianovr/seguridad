import { ApiProperty } from "@nestjs/swagger";

export class CredencialesDto {

    @ApiProperty({ example: 'nombre de usuario' })
    username: string;

    @ApiProperty({ example: 'contraseña' })
    password: string;

}

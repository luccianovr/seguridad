import { ApiProperty } from "@nestjs/swagger";

export class UpdateUsuarioDto {
    @ApiProperty({ description: 'contraseña actual para logear' })
    contraseña_actual: string;

    @ApiProperty({ description: 'nueva contraseña' })
    contraseña_nueva: string;
}

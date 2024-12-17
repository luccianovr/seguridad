import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
    @ApiProperty({ example: 'Proyecto 1', type: String })
    name: string

    @ApiProperty({ example: 'Gestión de Inventario', type: String })
    description: string

    @ApiProperty({ example: 'lucvil', type: String })
    @IsOptional()
    @IsString()
    usuario?: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateProjectDto {
    @ApiProperty({ example: 'Proyecto 1', type: String })
    @IsOptional()
    name: string

    @ApiProperty({ example: 'Gestión de Inventario', type: String })
    @IsOptional()
    description: string

    @ApiProperty({ example: 'lucvil', type: String })
    @IsOptional()
    @IsString()
    usuario?: string;
}

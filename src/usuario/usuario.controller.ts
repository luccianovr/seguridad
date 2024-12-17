import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { UsuarioExistePipe } from './pipe/usuario-existe.pipe';
import { CredencialesDto } from './dto/credenciales.dto';
import { AuthenticationGuard } from './guard/auth.guard';
import { RoleEnum } from './enum/role.enum';
import { RolesPermitidos } from 'src/decorator/roles.decorator';
import { ValidarRoles } from './guard/roles.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  @ApiBody({ type: CreateUsuarioDto })
  @UsePipes(ValidationPipe)
  @Post()
  async create(@Body(UsuarioExistePipe) createUsuarioDto: CreateUsuarioDto) {
    return await this.usuarioService.create(createUsuarioDto);
  }

  @ApiBody({ type: CredencialesDto })
  @Post('/login')
  async login(@Body() credenciales: CredencialesDto) {
    return await this.usuarioService.login(credenciales);
  }

  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @RolesPermitidos(RoleEnum.ADMIN)
  @UseGuards(AuthenticationGuard, ValidarRoles)
  @ApiParam({ name: 'role', enum: RoleEnum })
  @ApiParam({ name: 'username', type: String })
  @Post(':username/:role')
  changeRol(
    @Param('username') username: string,
    @Param('role') role: RoleEnum,
  ) {
    return this.usuarioService.changeRol(username, role);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @ApiBody({ type: UpdateUsuarioDto })
  @Patch('/password')
  async update(@Req() request, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    const datosUsuario = request['USUARIO'];
    return await this.usuarioService.update(updateUsuarioDto, datosUsuario);
  }
}

import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesPermitidos } from 'src/decorator/roles.decorator';
import { RoleEnum } from 'src/usuario/enum/role.enum';
import { AuthenticationGuard } from 'src/usuario/guard/auth.guard';
import { ValidarRoles } from 'src/usuario/guard/roles.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @RolesPermitidos(RoleEnum.ADMIN)
  @UseGuards(AuthenticationGuard, ValidarRoles)
  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() request
  ) {
    const datosUsuario = request['USUARIO'];
    return await this.projectsService.create(createProjectDto, datosUsuario);
  }

  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @RolesPermitidos(RoleEnum.ADMIN, RoleEnum.USUARIO)
  @UseGuards(AuthenticationGuard, ValidarRoles)
  @Get()
  async findOne(
    @Req() request
  ) {
    const datosUsuario = request['USUARIO'];
    return await this.projectsService.findOne(datosUsuario);
  }

  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @RolesPermitidos(RoleEnum.ADMIN, RoleEnum.USUARIO)
  @UseGuards(AuthenticationGuard, ValidarRoles)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() request
  ) {
    const datosUsuario = request['USUARIO'];
    return await this.projectsService.update(+id, updateProjectDto, datosUsuario);
  }

  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @RolesPermitidos(RoleEnum.ADMIN, RoleEnum.USUARIO)
  @UseGuards(AuthenticationGuard, ValidarRoles)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() request
  ) {
    const datosUsuario = request['USUARIO'];
    return this.projectsService.remove(+id, datosUsuario);
  }
}

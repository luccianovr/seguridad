import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { RoleEnum } from 'src/usuario/enum/role.enum';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) { }
  async create(createProjectDto: CreateProjectDto, datosUsuario: any) {

    const proyectoCreado = [];

    if (!createProjectDto.usuario || createProjectDto.usuario == '') {
      const usuarioAuth = await this.usuarioRepository.findOne({
        where: {
          username: datosUsuario.username
        }
      })
      //instanciar proyecto
      const proyectoEntity = new Project();
      proyectoEntity.description = createProjectDto.description;
      proyectoEntity.name = createProjectDto.name;
      proyectoEntity.usuario = usuarioAuth;

      //guardar entidad
      await this.projectRepository.save(proyectoEntity);
      proyectoCreado.push(proyectoEntity);
    }

    //buscar usuario a asignar
    const usuario = await this.usuarioRepository.findOne({
      where: {
        username: createProjectDto.usuario
      }
    });

    //nuevo proyecto
    const proyectoEntity = new Project();
    proyectoEntity.description = createProjectDto.description;
    proyectoEntity.name = createProjectDto.name;
    proyectoEntity.usuario = usuario;
    console.log(proyectoEntity)

    //guardar entidad
    await this.projectRepository.save(proyectoEntity);
    proyectoCreado.push(proyectoEntity);
    return proyectoCreado;
  }

  async findOne(datosUsuario: any) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        username: datosUsuario.username
      }
    })
    const proyectosUsuario = await this.projectRepository.find({
      where: {
        usuario: usuario
      }
    })

    return proyectosUsuario;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto, datosUsuario: any) {
    if (datosUsuario.rol == RoleEnum.ADMIN) {
      const proyectoEditar = await this.projectRepository.findOne({
        where: {
          id: id
        }
      })
      if (updateProjectDto.usuario) {
        const usuario = await this.usuarioRepository.findOne({
          where: {
            username: updateProjectDto.usuario
          }
        })

        proyectoEditar.usuario = usuario
        await this.projectRepository.save(proyectoEditar);
      }
      proyectoEditar.description = updateProjectDto.description;
      proyectoEditar.name = updateProjectDto.name;
      return await this.projectRepository.save(proyectoEditar);

    }

    if (datosUsuario.rol == RoleEnum.USUARIO) {
      if (updateProjectDto.usuario) {
        throw new BadRequestException('no puedes editar el propietario')
      }
      const usuario = await this.usuarioRepository.findOne({
        where: {
          username: datosUsuario.username
        }
      })
      const proyectoEditarPropietario = await this.projectRepository.findOne({
        where: {
          id: id,
          usuario: usuario
        }
      })
      if (!proyectoEditarPropietario) {
        throw new NotFoundException('El proyecto no es de tu propiedad o no existe');
      }
      proyectoEditarPropietario.description = updateProjectDto.description;
      proyectoEditarPropietario.name = updateProjectDto.name;
      return await this.projectRepository.save(proyectoEditarPropietario);

    }

  }

  async remove(id: number, datosUsuario: any) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        username: datosUsuario.username
      }
    });

    const proyectoEditarPropietario = await this.projectRepository.findOne({
      where: {
        id: id,
        usuario: usuario
      }
    })
    if (!proyectoEditarPropietario) {
      throw new NotFoundException('El proyecto no es de tu propiedad o no existe');
    };

    await this.projectRepository.delete(proyectoEditarPropietario);
    return true;
  }
}

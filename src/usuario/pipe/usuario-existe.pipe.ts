import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsuarioExistePipe implements PipeTransform {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
  ) { }
  async transform(value: any, metadata: ArgumentMetadata) {
    const usuarioExistente = await this.usuarioRepository.exists({
      where: {
        username: value.username,
        email: value.email
      }
    });
    if (usuarioExistente) {
      throw new BadRequestException('Username y/o email utilizados')
    }
    return value;
  }
}

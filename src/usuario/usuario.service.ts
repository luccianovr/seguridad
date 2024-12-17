import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as Crypto from 'crypto';
import { RoleEnum } from './enum/role.enum';
import { getUsuarioDto } from './dto/get-usuario.dto';
import { CredencialesDto } from './dto/credenciales.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuarioService {

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService
  ) { }
  async create(createUsuarioDto: CreateUsuarioDto) {

    const clave = createUsuarioDto.password_hash;
    const modo = 'md5';
    const passHashed = Crypto.createHash(modo).update(clave).digest('hex');
    //instanciar usuario entidad
    const usuarioEntity = new Usuario();

    //crear usuario nuevo
    usuarioEntity.username = createUsuarioDto.username;
    usuarioEntity.email = createUsuarioDto.email;
    usuarioEntity.password_hash = passHashed;
    usuarioEntity.role = RoleEnum.USUARIO;

    //guardar entidad en db
    await this.usuarioRepository.save(usuarioEntity)

    //getUsuarioDto

    const getUsuario = new getUsuarioDto();
    getUsuario.username = usuarioEntity.username;
    getUsuario.email = usuarioEntity.email;
    getUsuario.role = usuarioEntity.role;

    return getUsuario;
  }

  async login(credenciales: CredencialesDto) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        username: credenciales.username
      }
    });

    if (!usuario) {
      throw new UnauthorizedException(' Usuario o contraseña no es válido');
    };

    const modo = 'md5';
    const passHashed = Crypto.createHash(modo).update(credenciales.password).digest('hex');

    if (usuario.password_hash !== passHashed) {
      throw new UnauthorizedException('Usuario o contraseña no es válido');
    }

    const payload = {
      username: usuario.username,
      email: usuario.email,
      rol: usuario.role
    }
    const jwt = await this.jwtService.signAsync(payload);
    console.log(jwt)
    const jwtEncriptado = this.encriptar(jwt)
    console.log(this.desencriptar(jwtEncriptado))

    return {
      access_token: jwtEncriptado
    };
  }

  async update(updateUsuarioDto: UpdateUsuarioDto, datosUsuario: any) {
    const usuario = await this.usuarioRepository.findOne({
      where: {
        username: datosUsuario.username,
        email: datosUsuario.email
      }
    });
    if (!usuario) {
      throw new UnauthorizedException('Usuario sin permisos')
    };

    //validar contraseña actual
    const contraseñaActual = this.hashing(updateUsuarioDto.contraseña_actual);

    if (usuario.password_hash !== contraseñaActual) {
      throw new BadRequestException('La contraseña actual es incorrecta')
    };

    //cambiar contraseña

    const contraseñaNueva = this.hashing(updateUsuarioDto.contraseña_nueva);

    await this.usuarioRepository.update(usuario, { password_hash: contraseñaNueva })

    return 'contraseña cambiada con éxito'
  }

  async changeRol(username: string, role: RoleEnum) {
    const usuarioEditado = await this.usuarioRepository.findOne({
      where: {
        username: username
      }
    });

    if (!usuarioEditado) {
      throw new NotFoundException('Usuario inexistente')
    }

    if (!Object.values(RoleEnum).includes(role)) {
      throw new BadRequestException(`El rol '${role}' no es válido.`);
    }
    //cambiado rol
    try {
      usuarioEditado.role = role;
      console.log(usuarioEditado.role)
      await this.usuarioRepository.save(usuarioEditado)
    } catch (err) {
      throw new InternalServerErrorException('Error al actualizar el rol')
    }

    return 'usuario editado con éxito'
  }

  encriptar(textoOriginal: string) {
    const password = 'ASD123'; // Clave original
    const key = Crypto.createHash('sha256').update(password).digest(); // Clave de 32 bytes
    const modo = 'AES-256-CBC';

    const iv = Crypto.randomBytes(16); // Genera IV aleatorio
    const cipher = Crypto.createCipheriv(modo, key, iv);

    const textoEncriptado = Buffer.concat([
      cipher.update(textoOriginal, 'utf8'),
      cipher.final(),
    ]);

    return `${iv.toString('hex')}:${textoEncriptado.toString('hex')}`;
  }

  desencriptar(textoEncriptado: string): string {
    const password = 'ASD123'; // Clave original
    const key = Crypto.createHash('sha256').update(password).digest(); // Genera la clave de 32 bytes
    const modo = 'AES-256-CBC';

    // Separar IV y texto encriptado
    const [ivHex, textoHex] = textoEncriptado.split(':');
    if (!ivHex || !textoHex) {
      throw new Error('Formato del texto encriptado inválido');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(textoHex, 'hex');

    // Crear el decipher
    const decipher = Crypto.createDecipheriv(modo, key, iv);

    // Desencriptar el texto
    const textoDesencriptado = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);

    return textoDesencriptado.toString('utf8');
  }

  hashing(textoOriginal: string): string {
    const modo = 'md5';
    const modificador = textoOriginal;
    const hash = Crypto.createHash(modo).update(modificador).digest('hex');
    return hash;
  }

}

import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario/entities/usuario.entity';
import { UsuarioController } from './usuario/usuario.controller';
import { UsuarioService } from './usuario/usuario.service';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entities/project.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'mysql',
      port: 3306,
      username: 'root',
      password: 'clave123',
      database: 'project_management',
      entities: [
        Usuario,
        Project
      ]
    }),
    UsuarioModule,
    ProjectsModule,
    JwtModule.register({
      global: true,
      secret: 'jsonwebtoken',
      signOptions: {
        expiresIn: '1h'
      }
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Usuario])
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule { }

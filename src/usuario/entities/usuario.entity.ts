import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { RoleEnum } from "../enum/role.enum";
import { Project } from "src/projects/entities/project.entity";

@Entity({ name: 'users' })
export class Usuario {
    @PrimaryColumn({ name: 'username' })
    username: string

    @Column({ name: 'email' })
    email: string

    @Column({ name: 'password_hash' })
    password_hash: string

    @Column({ name: 'role' })
    role: RoleEnum

    @OneToMany(() => Project, (p) => p.usuario)
    projects: Project[]
}

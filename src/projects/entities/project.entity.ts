import { Usuario } from "src/usuario/entities/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'projects' })
export class Project {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number

    @Column({ name: 'name' })
    name: string

    @Column({ name: 'description' })
    description: string

    @ManyToOne(() => Usuario, { nullable: false })
    @JoinColumn({ name: 'user_username' })
    usuario: Usuario;
}

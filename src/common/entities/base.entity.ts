import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class BaseEntity {

    @Exclude()
    @Column({ default: '' })
    createdBy: string;

    @Exclude()
    @Column({ default: '' })
    updatedBy: string;

    @Exclude()
    @Column({ default: '' })
    deletedBy: string;

    @Exclude()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @Exclude()
    @CreateDateColumn({ type: 'timestamptz'})
    updatedAt: Date;

    @Exclude()
    @DeleteDateColumn({ type: 'timestamptz', nullable: true })
    deletedAt?: Date;
}
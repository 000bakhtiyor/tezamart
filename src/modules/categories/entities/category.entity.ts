import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'categories',
    orderBy: {
        createdAt: 'DESC'
    }
})
export class Category extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'jsonb', nullable: true })
    name: Record<string, string>;
}

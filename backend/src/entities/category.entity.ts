import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Initiative } from './initiative.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column({ nullable: true, length: 255 })
  description: string;

  @Column({ nullable: true, length: 50 })
  icon: string;

  @OneToMany(() => Initiative, (initiative) => initiative.category)
  initiatives: Initiative[];
}

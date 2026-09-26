import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Enrollment } from './enrollment.entity';

export enum InitiativeStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('initiatives')
export class Initiative {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true, length: 255 })
  requirements: string;

  @Column({ nullable: true, length: 255 })
  benefits: string;

  @Column({ length: 150 })
  city: string;

  @Column({ length: 255 })
  location: string;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7, nullable: true })
  longitude: number;

  @Column({ type: 'date' })
  eventDate: string;

  @Column({ type: 'time' })
  eventTime: string;

  @Column({ default: 0 })
  capacity: number;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'enum', enum: InitiativeStatus, default: InitiativeStatus.UPCOMING })
  status: InitiativeStatus;

  @ManyToOne(() => Category, (category) => category.initiatives, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: number;

  @ManyToOne(() => User, (user) => user.organizedInitiatives)
  @JoinColumn({ name: 'organizerId' })
  organizer: User;

  @Column()
  organizerId: number;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.initiative)
  enrollments: Enrollment[];

  @CreateDateColumn()
  createdAt: Date;
}

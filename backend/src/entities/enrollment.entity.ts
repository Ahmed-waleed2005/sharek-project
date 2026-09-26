import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Initiative } from './initiative.entity';

export enum EnrollmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  ATTENDED = 'attended',
  CANCELLED = 'cancelled',
}

@Entity('enrollments')
@Unique(['user', 'initiative'])
export class Enrollment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.enrollments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Initiative, (initiative) => initiative.enrollments)
  @JoinColumn({ name: 'initiativeId' })
  initiative: Initiative;

  @Column()
  initiativeId: number;

  @Column({ type: 'enum', enum: EnrollmentStatus, default: EnrollmentStatus.CONFIRMED })
  status: EnrollmentStatus;

  @CreateDateColumn()
  joinedAt: Date;
}

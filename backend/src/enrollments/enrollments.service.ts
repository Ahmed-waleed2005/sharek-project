import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from '../entities/enrollment.entity';
import { Initiative } from '../entities/initiative.entity';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment) private enrollmentsRepo: Repository<Enrollment>,
    @InjectRepository(Initiative) private initiativesRepo: Repository<Initiative>,
  ) {}

  async join(initiativeId: number, userId: number) {
    const initiative = await this.initiativesRepo.findOne({ where: { id: initiativeId } });
    if (!initiative) throw new NotFoundException('المبادرة غير موجودة');

    const existing = await this.enrollmentsRepo.findOne({
      where: { initiativeId, userId },
    });
    if (existing) throw new ConflictException('أنت منضم بالفعل لهذه المبادرة');

    const currentCount = await this.enrollmentsRepo.count({ where: { initiativeId } });
    if (initiative.capacity && currentCount >= initiative.capacity) {
      throw new ConflictException('اكتمل العدد المطلوب لهذه المبادرة');
    }

    const enrollment = this.enrollmentsRepo.create({ initiativeId, userId });
    return this.enrollmentsRepo.save(enrollment);
  }

  async leave(initiativeId: number, userId: number) {
    const existing = await this.enrollmentsRepo.findOne({ where: { initiativeId, userId } });
    if (!existing) throw new NotFoundException('أنت غير منضم لهذه المبادرة');
    await this.enrollmentsRepo.delete(existing.id);
    return { left: true };
  }

  myInitiatives(userId: number) {
    return this.enrollmentsRepo.find({
      where: { userId },
      relations: ['initiative', 'initiative.category'],
      order: { joinedAt: 'DESC' },
    });
  }

  participantsOf(initiativeId: number) {
    return this.enrollmentsRepo.find({
      where: { initiativeId },
      relations: ['user'],
    });
  }
}

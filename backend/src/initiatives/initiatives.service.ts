import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Initiative } from '../entities/initiative.entity';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { QueryInitiativeDto } from './dto/query-initiative.dto';

@Injectable()
export class InitiativesService {
  constructor(@InjectRepository(Initiative) private repo: Repository<Initiative>) {}

  async findAll(query: QueryInitiativeDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '9', 10);

    const qb = this.repo
      .createQueryBuilder('initiative')
      .leftJoinAndSelect('initiative.category', 'category')
      .leftJoinAndSelect('initiative.organizer', 'organizer')
      .loadRelationCountAndMap('initiative.enrolledCount', 'initiative.enrollments');

    if (query.search) {
      qb.andWhere('(initiative.title LIKE :s OR initiative.description LIKE :s)', {
        s: `%${query.search}%`,
      });
    }
    if (query.categoryId) {
      qb.andWhere('initiative.categoryId = :categoryId', { categoryId: query.categoryId });
    }
    if (query.city) {
      qb.andWhere('initiative.city LIKE :city', { city: `%${query.city}%` });
    }

    if (query.sort === 'soonest') {
      qb.orderBy('initiative.eventDate', 'ASC');
    } else {
      qb.orderBy('initiative.createdAt', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number) {
    const initiative = await this.repo
      .createQueryBuilder('initiative')
      .leftJoinAndSelect('initiative.category', 'category')
      .leftJoinAndSelect('initiative.organizer', 'organizer')
      .loadRelationCountAndMap('initiative.enrolledCount', 'initiative.enrollments')
      .where('initiative.id = :id', { id })
      .getOne();

    if (!initiative) throw new NotFoundException('المبادرة غير موجودة');
    return initiative;
  }

  findForMap() {
    return this.repo.find({
      relations: ['category'],
      where: {},
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        city: true,
        eventDate: true,
      },
    });
  }

  create(dto: CreateInitiativeDto, organizerId: number) {
    const initiative = this.repo.create({ ...dto, organizerId });
    return this.repo.save(initiative);
  }

  async update(id: number, dto: UpdateInitiativeDto, userId: number, role: string) {
    const initiative = await this.findOne(id);
    if (initiative.organizerId !== userId && role !== 'admin') {
      throw new ForbiddenException('لا يمكنك تعديل مبادرة لا تخصك');
    }
    Object.assign(initiative, dto);
    return this.repo.save(initiative);
  }

  async remove(id: number, userId: number, role: string) {
    const initiative = await this.findOne(id);
    if (initiative.organizerId !== userId && role !== 'admin') {
      throw new ForbiddenException('لا يمكنك حذف مبادرة لا تخصك');
    }
    await this.repo.delete(id);
    return { deleted: true };
  }
}

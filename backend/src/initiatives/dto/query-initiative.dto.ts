import { IsOptional, IsNumberString } from 'class-validator';

export class QueryInitiativeDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsNumberString()
  categoryId?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  sort?: 'newest' | 'soonest' | 'popular';

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}

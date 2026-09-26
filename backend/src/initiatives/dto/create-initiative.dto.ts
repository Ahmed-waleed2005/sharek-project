import { IsNotEmpty, IsOptional, IsNumber, IsDateString, Min } from 'class-validator';

export class CreateInitiativeDto {
  @IsNotEmpty({ message: 'عنوان المبادرة مطلوب' })
  title: string;

  @IsNotEmpty({ message: 'وصف المبادرة مطلوب' })
  description: string;

  @IsOptional()
  requirements?: string;

  @IsOptional()
  benefits?: string;

  @IsNotEmpty({ message: 'المدينة مطلوبة' })
  city: string;

  @IsNotEmpty({ message: 'الموقع مطلوب' })
  location: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsDateString({}, { message: 'تاريخ غير صحيح' })
  eventDate: string;

  @IsNotEmpty({ message: 'الوقت مطلوب' })
  eventTime: string;

  @IsNumber()
  @Min(1, { message: 'السعة يجب أن تكون أكبر من صفر' })
  capacity: number;

  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  categoryId: number;
}

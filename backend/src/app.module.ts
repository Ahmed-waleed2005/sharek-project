import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { User } from './entities/user.entity';
import { Category } from './entities/category.entity';
import { Initiative } from './entities/initiative.entity';
import { Enrollment } from './entities/enrollment.entity';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { InitiativesModule } from './initiatives/initiatives.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '3306'), 10),
        username: config.get('DB_USERNAME', 'root'),
        password: config.get('DB_PASSWORD', ''),
        database: config.get('DB_DATABASE', 'sharek'),
        entities: [User, Category, Initiative, Enrollment],
        synchronize: true, // dev only — use migrations in production
        charset: 'utf8mb4',
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'frontend'),
      exclude: ['/api/*'],
    }),
    AuthModule,
    UsersModule,
    CategoriesModule,
    InitiativesModule,
    EnrollmentsModule,
  ],
})
export class AppModule {}

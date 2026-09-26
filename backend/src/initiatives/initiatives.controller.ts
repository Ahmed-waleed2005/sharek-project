import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { InitiativesService } from './initiatives.service';
import { CreateInitiativeDto } from './dto/create-initiative.dto';
import { UpdateInitiativeDto } from './dto/update-initiative.dto';
import { QueryInitiativeDto } from './dto/query-initiative.dto';

@Controller('initiatives')
export class InitiativesController {
  constructor(private initiativesService: InitiativesService) {}

  @Get()
  findAll(@Query() query: QueryInitiativeDto) {
    return this.initiativesService.findAll(query);
  }

  @Get('map')
  findForMap() {
    return this.initiativesService.findForMap();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.initiativesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @Post()
  create(@Body() dto: CreateInitiativeDto, @Req() req: any) {
    return this.initiativesService.create(dto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateInitiativeDto, @Req() req: any) {
    return this.initiativesService.update(+id, dto, req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('organizer', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    return this.initiativesService.remove(+id, req.user.userId, req.user.role);
  }
}

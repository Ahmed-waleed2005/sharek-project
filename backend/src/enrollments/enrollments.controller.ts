import { Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';

@Controller()
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiatives/:id/join')
  join(@Param('id') id: string, @Req() req: any) {
    return this.enrollmentsService.join(+id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('initiatives/:id/join')
  leave(@Param('id') id: string, @Req() req: any) {
    return this.enrollmentsService.leave(+id, req.user.userId);
  }

  @Get('initiatives/:id/participants')
  participants(@Param('id') id: string) {
    return this.enrollmentsService.participantsOf(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/me/initiatives')
  myInitiatives(@Req() req: any) {
    return this.enrollmentsService.myInitiatives(req.user.userId);
  }
}

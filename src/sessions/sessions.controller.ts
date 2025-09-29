import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Headers,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new session' })
  @ApiResponse({ status: 201, description: 'Session created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSession(
    @Request() req: { user: { id: string } },
    @Headers('user-agent') userAgent?: string,
    @Headers('x-forwarded-for') forwardedFor?: string,
    @Headers('x-real-ip') realIp?: string,
  ) {
    const ipAddress = forwardedFor || realIp;
    return this.sessionsService.createSession(
      req.user.id,
      userAgent,
      ipAddress,
    );
  }

  @Get('validate/:token')
  @ApiOperation({ summary: 'Validate session token' })
  @ApiParam({ name: 'token', description: 'Session token' })
  @ApiResponse({ status: 200, description: 'Session is valid' })
  @ApiResponse({ status: 401, description: 'Invalid or expired session' })
  async validateSession(@Param('token') token: string) {
    const { user, session } = await this.sessionsService.validateSession(token);
    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        status: user.status,
      },
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
      },
    };
  }

  @Delete(':token')
  @ApiOperation({ summary: 'Invalidate session token' })
  @ApiParam({ name: 'token', description: 'Session token' })
  @ApiResponse({ status: 200, description: 'Session invalidated successfully' })
  async invalidateSession(@Param('token') token: string) {
    await this.sessionsService.invalidateSession(token);
    return { message: 'Session invalidated successfully' };
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Cleanup expired sessions' })
  @ApiResponse({ status: 200, description: 'Expired sessions cleaned up' })
  async cleanupExpiredSessions() {
    await this.sessionsService.cleanupExpiredSessions();
    return { message: 'Expired sessions cleaned up' };
  }
}

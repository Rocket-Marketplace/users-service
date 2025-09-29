import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { User } from '../users/entities/user.entity';
import * as crypto from 'crypto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createSession(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<Session> {
    // Invalidate all existing sessions for this user
    await this.invalidateUserSessions(userId);

    // Generate a secure token
    const token = this.generateSecureToken();

    // Create session with 24h expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const session = this.sessionRepository.create({
      userId,
      token,
      expiresAt,
      userAgent: userAgent || null,
      ipAddress: ipAddress || null,
      isActive: true,
    });

    return this.sessionRepository.save(session);
  }

  async validateSession(token: string): Promise<{ user: User; session: Session }> {
    const session = await this.sessionRepository.findOne({
      where: { token, isActive: true },
      relations: ['user'],
    });

    if (!session) {
      throw new UnauthorizedException('Invalid session token');
    }

    if (session.expiresAt < new Date()) {
      // Mark session as inactive
      session.isActive = false;
      await this.sessionRepository.save(session);
      throw new UnauthorizedException('Session expired');
    }

    if (!session.user) {
      throw new NotFoundException('User not found for session');
    }

    return { user: session.user, session };
  }

  async invalidateSession(token: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { token },
    });

    if (session) {
      session.isActive = false;
      await this.sessionRepository.save(session);
    }
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    await this.sessionRepository.update(
      { userId, isActive: true },
      { isActive: false },
    );
  }

  async cleanupExpiredSessions(): Promise<void> {
    await this.sessionRepository
      .createQueryBuilder()
      .update(Session)
      .set({ isActive: false })
      .where('expiresAt < :now AND isActive = :active', { 
        now: new Date(), 
        active: true 
      })
      .execute();
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}

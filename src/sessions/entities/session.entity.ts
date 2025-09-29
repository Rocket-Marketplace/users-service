import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('sessions')
export class Session {
  @ApiProperty({ description: 'Session ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID' })
  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @ApiProperty({ description: 'Session token' })
  @Column({ type: 'varchar', length: 500, unique: true })
  @Index()
  token: string;

  @ApiProperty({ description: 'Session expires at' })
  @Column({ type: 'timestamp' })
  @Index()
  expiresAt: Date;

  @ApiProperty({ description: 'Session is active' })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'User agent' })
  @Column({ type: 'text', nullable: true })
  userAgent: string | null;

  @ApiProperty({ description: 'IP address' })
  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}

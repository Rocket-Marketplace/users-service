import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  SELLER = 'seller',
  BUYER = 'buyer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'User ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User email' })
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @ApiProperty({ description: 'User password hash' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'User first name' })
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({ description: 'User phone number' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @ApiProperty({ description: 'User status', enum: UserStatus })
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @ApiProperty({ description: 'User address' })
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty({ description: 'User city' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @ApiProperty({ description: 'User state' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @ApiProperty({ description: 'User postal code' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  postalCode: string;

  @ApiProperty({ description: 'User country' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @ApiProperty({ description: 'Email verification token' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  emailVerificationToken: string | null;

  @ApiProperty({ description: 'Password reset token' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  passwordResetToken: string | null;

  @ApiProperty({ description: 'Password reset expires' })
  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires: Date | null;

  @ApiProperty({ description: 'Last login date' })
  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;
}

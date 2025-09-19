import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User, UserStatus, UserRole } from '../users/entities/user.entity';
import { CreateUserDto } from '../common/dto/create-user.dto';
import { LoginDto } from '../common/dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: '$2a$10$hashedPassword',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: UserRole.BUYER,
    status: UserStatus.ACTIVE,
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'USA',
    emailVerificationToken: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.BUYER,
      };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(createUserDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(result.user).not.toHaveProperty('password');
      expect(result.token).toBe('jwt-token');
    });

    it('should throw ConflictException when user already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: UserRole.BUYER,
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.register(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock bcrypt.compare to return true for valid password
      const bcrypt = jest.requireMock('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.update.mockResolvedValue({});
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(result.user).not.toHaveProperty('password');
      expect(result.token).toBe('jwt-token');
    });

    it('should throw UnauthorizedException with invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      // Mock bcrypt.compare to return false for invalid password
      const bcrypt = jest.requireMock('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user is not active', async () => {
      const inactiveUser = { ...mockUser, status: UserStatus.INACTIVE };
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      // Mock bcrypt.compare to return true for valid password
      const bcrypt = jest.requireMock('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      mockRepository.findOne.mockResolvedValue(inactiveUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});

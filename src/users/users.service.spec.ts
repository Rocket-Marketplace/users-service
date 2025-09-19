import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserStatus, UserRole } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'hashedPassword',
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
    createQueryBuilder: jest.fn(() => ({
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn(),
    })),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update user when user is the owner', async () => {
      const updateData = { firstName: 'Jane' };
      const updatedUser = { ...mockUser, firstName: 'Jane' };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(
        '123e4567-e89b-12d3-a456-426614174000',
        updateData,
        '123e4567-e89b-12d3-a456-426614174000',
      );

      expect(result.firstName).toBe('Jane');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.update(
          '123e4567-e89b-12d3-a456-426614174000',
          {},
          'different-user-id',
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findSellers', () => {
    it('should return active sellers without passwords', async () => {
      const sellers = [mockUser];
      mockRepository.find.mockResolvedValue(sellers);

      const result = await service.findSellers();

      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { role: 'seller', status: UserStatus.ACTIVE },
      });
      expect(result[0]).not.toHaveProperty('password');
    });
  });
});

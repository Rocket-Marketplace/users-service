import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus, UserRole } from './entities/user.entity';
import { UpdateUserDto } from '../common/dto/update-user.dto';
import { UserQueryDto } from '../common/dto/user-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: UserQueryDto): Promise<{
    users: Omit<User, 'password'>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, role, status } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (search) {
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    const [users, total] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const usersWithoutPassword = users.map(({ password, ...user }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = password;
      return user;
    });

    return {
      users: usersWithoutPassword,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    currentUserId: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (id !== currentUserId) {
      throw new ForbiddenException('You can only update your own profile');
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string, currentUserId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (id !== currentUserId) {
      throw new ForbiddenException('You can only delete your own profile');
    }

    user.status = UserStatus.INACTIVE;
    await this.userRepository.save(user);
  }

  async updateStatus(
    id: string,
    status: UserStatus,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.status = status;
    const updatedUser = await this.userRepository.save(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async findSellers(): Promise<Omit<User, 'password'>[]> {
    const sellers = await this.userRepository.find({
      where: { role: UserRole.SELLER, status: UserStatus.ACTIVE },
    });

    return sellers.map(({ password, ...user }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = password;
      return user;
    });
  }
}

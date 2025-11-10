import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  private idCounter = 2;

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = this.users.find(
      (user) => user.email === createUserDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const { password, ...userWithoutPassword } = createUserDto;
    const newUser: User = {
      id: String(this.idCounter++),
      ...userWithoutPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<User>> {
    const total = this.users.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = this.users.slice(skip, skip + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check if email is being updated and if it already exists
    if (updateUserDto.email) {
      const existingUser = this.users.find(
        (user) => user.email === updateUserDto.email && user.id !== id,
      );

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    const { password, ...updateWithoutPassword } = updateUserDto;
    const updatedUser = {
      ...this.users[userIndex],
      ...updateWithoutPassword,
      updatedAt: new Date(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    this.users.splice(userIndex, 1);
  }
}

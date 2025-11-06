import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { IReturnPaginated } from '../interfaces/returnPaginated.struct';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { AccountType } from '../enums/account-type.enum';
import { IFindOne } from '../interfaces/findOne.struct';
import { IFindAll } from '../interfaces/findAll.struct';
import { ICreate } from '../interfaces/create.struct';
import { IUpdate } from '../interfaces/update.struct';
import { IRemove } from '../interfaces/remove.struct';
import UsersEntity from '../entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async create(data: ICreate): Promise<Partial<UsersEntity>> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const newEntry = this.usersRepository.create({
      ...data,
      passwordHash: hashedPassword,
    });
    const savedNewEntry = await this.usersRepository.save(newEntry);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...safeUser } = savedNewEntry;
    return safeUser;
  }

  async findAll(data: IFindAll): Promise<IReturnPaginated> {
    const [entries, total] = await this.usersRepository.findAndCount({
      skip: (data.page - 1) * data.limit,
      take: data.limit,
      select: [
        'id',
        'profilePictureUrl',
        'username',
        'email',
        'accountType',
        'createdAt',
        'updatedAt',
        'ratingCount',
        'lastLogin',
      ],
      order: { createdAt: 'DESC' },
    });

    if (entries.length === 0) {
      throw new NotFoundException('No users found.');
    }

    return {
      data: entries,
      currentPage: data.page,
      total,
    };
  }

  async findOne(data: IFindOne, req?: IRequest): Promise<UsersEntity> {
    const foundEntry = await this.usersRepository.findOne({
      where: [
        { id: data.id },
        { username: data.username },
        { email: data.email },
      ],
    });

    if (!foundEntry) {
      throw new NotFoundException('Entry not found.');
    }

    if (req) {
      if (
        req.user?.accountType !== AccountType.ADMIN &&
        foundEntry.id !== req.user?.userId
      ) {
        throw new ForbiddenException('You can only access your own account.');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, refreshTokenHash, ...safeUser } = foundEntry;
      return safeUser as UsersEntity;
    }

    // Internal Calls (no req) will return everything to compare hashs
    return foundEntry;
  }

  async update(data: IUpdate, req?: IRequest): Promise<Partial<UsersEntity>> {
    const foundEntry = await this.usersRepository.findOne({
      where: { id: data.id },
    });

    if (!foundEntry) {
      throw new NotFoundException(`${data.id} not found.`);
    }

    if (req) {
      if (
        req.user?.accountType !== AccountType.ADMIN &&
        foundEntry.id !== req.user?.userId
      ) {
        throw new ForbiddenException('You can only access your own account.');
      }
    }

    const merged = this.usersRepository.merge(foundEntry, data);
    const saved = await this.usersRepository.save(merged);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...safeUser } = saved;
    return safeUser;
  }

  async remove(data: IRemove, req?: IRequest): Promise<Partial<UsersEntity>> {
    const foundEntry = await this.usersRepository.findOne({
      where: { id: data.id },
    });

    if (!foundEntry) {
      throw new NotFoundException(`${data.id} not found.`);
    }

    if (req) {
      if (
        req.user?.accountType !== AccountType.ADMIN &&
        foundEntry.id !== req.user?.userId
      ) {
        throw new ForbiddenException('You can only access your own account.');
      }
    }

    await this.usersRepository.remove(foundEntry);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, refreshTokenHash, ...safeUser } = foundEntry;
    return safeUser;
  }

  async incrementRatingCount(userId: string): Promise<void> {
    try {
      await this.usersRepository.increment({ id: userId }, 'ratingCount', 1);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to increment ratingCount for user ${userId}: ${error.message}`,
      );
    }
  }

  async decrementRatingCount(userId: string): Promise<void> {
    let result;

    try {
      result = await this.usersRepository
        .createQueryBuilder()
        .update('users')
        .set({ ratingCount: () => 'rating_count - 1' })
        .where('id = :userId', { userId })
        .andWhere('rating_count > 0')
        .execute();
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to decrement ratingCount for user ${userId}: ${error.message}`,
      );
    }

    if (result.affected === 0) {
      throw new BadRequestException(
        `Cannot decrement ratingCount for user ${userId} (already 0 or not found).`,
      );
    }
  }
}

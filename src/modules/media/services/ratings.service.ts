import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IReturnPaginatedRatings } from '../interfaces/ratings-returnPaginated.struct';
import { AccountType } from 'src/modules/users/enums/account-type.enum';
import { IFindAllRatings } from '../interfaces/ratings-findAll.struct';
import { IFindOneRating } from '../interfaces/ratings-findOne.struct';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { ICreateRating } from '../interfaces/ratings-create.struct';
import { IUpdateRating } from '../interfaces/ratings-update.struct';
import { IRemoveRating } from '../interfaces/ratings-remove.struct';
import UsersEntity from 'src/modules/users/entities/users.entity';
import RatingEntity from '../entities/rating.entity';
import MediaEntity from '../entities/media.entity';

@Injectable()
export class RatingsService {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
  ) {}

  async create(data: ICreateRating): Promise<RatingEntity> {
    const media = await this.mediaRepository.findOne({
      where: { id: data.mediaId },
    });

    if (!media) {
      throw new NotFoundException(`Media ${data.mediaId} not found.`);
    }

    if (media.userId === data.userId) {
      throw new ForbiddenException('You cannot rate your own media.');
    }

    const existingRating = await this.ratingRepository.findOne({
      where: { userId: data.userId, mediaId: data.mediaId },
    });

    if (existingRating) {
      throw new BadRequestException('User has already rated this media.');
    }

    return await this.ratingRepository.manager.transaction(async (manager) => {
      const newRating = manager.create(RatingEntity, data);
      const savedRating = await manager.save(newRating);

      await manager.increment(
        UsersEntity,
        { id: data.userId },
        'ratingCount',
        1,
      );

      return savedRating;
    });
  }

  async findAll(data: IFindAllRatings): Promise<IReturnPaginatedRatings> {
    const where: any = {};
    if (data.mediaId) where.mediaId = data.mediaId;
    if (data.userId) where.userId = data.userId;

    const [entries, total] = await this.ratingRepository.findAndCount({
      where,
      skip: (data.page - 1) * data.limit,
      take: data.limit,
      relations: ['user', 'media'],
      order: { createdAt: 'DESC' },
    });

    if (entries.length === 0) {
      throw new NotFoundException('No ratings found.');
    }

    const safeEntries = entries.map((entry) => {
      if (entry.user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passwordHash, refreshTokenHash, ...safeUser } = entry.user;
        entry.user = safeUser as UsersEntity;
      }
      return entry;
    });

    return {
      data: safeEntries,
      currentPage: data.page,
      total,
    };
  }

  async findOne(data: IFindOneRating): Promise<RatingEntity> {
    const foundEntry = await this.ratingRepository.findOne({
      where: { id: data.id },
      relations: ['user', 'media'],
    });

    if (!foundEntry) {
      throw new NotFoundException('Rating not found.');
    }

    if (foundEntry.user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, refreshTokenHash, ...safeUser } = foundEntry.user;
      foundEntry.user = safeUser as UsersEntity;
    }

    return foundEntry;
  }

  async update(data: IUpdateRating, req?: IRequest): Promise<RatingEntity> {
    const foundEntry = await this.ratingRepository.findOne({
      where: { id: data.id },
    });

    if (!foundEntry) {
      throw new NotFoundException(`Rating ${data.id} not found.`);
    }

    if (req) {
      if (
        req.user?.accountType !== AccountType.ADMIN &&
        foundEntry.userId !== req.user?.userId
      ) {
        throw new ForbiddenException('You can only update your own rating.');
      }
    }

    const merged = this.ratingRepository.merge(foundEntry, data);
    return await this.ratingRepository.save(merged);
  }

  async remove(data: IRemoveRating, req?: IRequest): Promise<RatingEntity> {
    return await this.ratingRepository.manager.transaction(async (manager) => {
      const foundEntry = await manager.findOne(RatingEntity, {
        where: { id: data.id },
      });

      if (!foundEntry) {
        throw new NotFoundException(`Rating ${data.id} not found.`);
      }

      if (req) {
        if (
          req.user?.accountType !== AccountType.ADMIN &&
          foundEntry.userId !== req.user?.userId
        ) {
          throw new ForbiddenException('You can only delete your own rating.');
        }
      }

      await manager.remove(foundEntry);

      const result = await manager
        .createQueryBuilder()
        .update(UsersEntity)
        .set({ ratingCount: () => 'rating_count - 1' })
        .where('id = :userId', { userId: foundEntry.userId })
        .andWhere('rating_count > 0')
        .execute();

      if (result.affected === 0) {
        throw new BadRequestException('Cannot decrement ratingCount.');
      }

      return foundEntry;
    });
  }
}

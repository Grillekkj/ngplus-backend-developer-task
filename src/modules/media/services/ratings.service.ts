import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { IReturnPaginatedRatings } from '../interfaces/ratings-returnPaginated.struct';
import { UsersService } from 'src/modules/users/services/users.service';
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
  private readonly logger = new Logger(RatingsService.name);
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly usersService: UsersService,
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

    const newRating = this.ratingRepository.create(data);
    const savedRating = await this.ratingRepository.save(newRating);

    await this.incrementUserRatingCount(data.userId);

    return savedRating;
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
        throw new ForbiddenException('You can only delete your own rating.');
      }
    }

    await this.ratingRepository.remove(foundEntry);

    await this.decrementUserRatingCount(foundEntry.userId);

    return foundEntry;
  }

  private async incrementUserRatingCount(userId: string): Promise<void> {
    try {
      const user = await this.usersService.findOne({ id: userId });
      await this.usersService.update({
        id: userId,
        ratingCount: user.ratingCount + 1,
      });
    } catch (error) {
      this.logger.error('Failed to increment ratingCount:', error);
      throw new InternalServerErrorException(
        `Failed to increment ratingCount for user ${userId}`,
      );
    }
  }

  private async decrementUserRatingCount(userId: string): Promise<void> {
    try {
      const user = await this.usersService.findOne({ id: userId });
      if (user.ratingCount > 0) {
        await this.usersService.update({
          id: userId,
          ratingCount: user.ratingCount - 1,
        });
      }
    } catch (error) {
      this.logger.error('Failed to decrement ratingCount:', error);
      throw new InternalServerErrorException(
        `Failed to decrement ratingCount for user ${userId}`,
      );
    }
  }
}

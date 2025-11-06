import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { IReturnPaginatedMedia } from '../interfaces/media-returnPaginated.struct';
import { AccountType } from 'src/modules/users/enums/account-type.enum';
import { IRequest } from 'src/modules/auth/interfaces/request.struct';
import { IFindOneMedia } from '../interfaces/media-findOne.struct';
import { IFindAllMedia } from '../interfaces/media-findAll.struct';
import UsersEntity from 'src/modules/users/entities/users.entity';
import { IUpdateMedia } from '../interfaces/media-update.struct';
import { IRemoveMedia } from '../interfaces/media-remove.struct';
import { ICreateMedia } from '../interfaces/media-create.struct';
import MediaEntity from '../entities/media.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
  ) {}

  async create(data: ICreateMedia): Promise<MediaEntity> {
    const newEntry = this.mediaRepository.create(data);
    return await this.mediaRepository.save(newEntry);
  }

  async findAll(data: IFindAllMedia): Promise<IReturnPaginatedMedia> {
    const [entries, total] = await this.mediaRepository.findAndCount({
      skip: (data.page - 1) * data.limit,
      take: data.limit,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    if (entries.length === 0) {
      throw new NotFoundException('No media found.');
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

  async findOne(data: IFindOneMedia): Promise<MediaEntity> {
    const foundEntry = await this.mediaRepository.findOne({
      where: { id: data.id },
      relations: ['user'],
    });

    if (!foundEntry) {
      throw new NotFoundException('Media not found.');
    }

    if (foundEntry.user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash, refreshTokenHash, ...safeUser } = foundEntry.user;
      foundEntry.user = safeUser as UsersEntity;
    }

    return foundEntry;
  }

  async update(data: IUpdateMedia, req: IRequest): Promise<MediaEntity> {
    const foundEntry = await this.mediaRepository.findOne({
      where: { id: data.id },
    });

    if (!foundEntry) {
      throw new NotFoundException(`Media ${data.id} not found.`);
    }

    if (req) {
      if (
        req.user?.accountType !== AccountType.ADMIN &&
        foundEntry.userId !== req.user?.userId
      ) {
        throw new ForbiddenException('You can only update your own media.');
      }
    }

    const merged = this.mediaRepository.merge(foundEntry, data);
    return await this.mediaRepository.save(merged);
  }

  async remove(data: IRemoveMedia, req: IRequest): Promise<MediaEntity> {
    const foundEntry = await this.mediaRepository.findOne({
      where: { id: data.id },
    });

    if (!foundEntry) {
      throw new NotFoundException(`Media ${data.id} not found.`);
    }

    if (req) {
      if (
        req.user?.accountType !== AccountType.ADMIN &&
        foundEntry.userId !== req.user?.userId
      ) {
        throw new ForbiddenException('You can only delete your own media.');
      }
    }

    await this.mediaRepository.remove(foundEntry);
    return foundEntry;
  }
}

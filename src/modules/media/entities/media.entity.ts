import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import UsersEntity from '../../users/entities/users.entity';
import { MediaCategory } from '../enums/category.enum';

@Entity('media')
export default class MediaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: 'https://example.com/default-profile.png',
  })
  thumbnailUrl?: string;

  @Column({ type: 'varchar', length: 255 })
  contentUrl: string;

  @Column({ type: 'enum', enum: MediaCategory })
  mediaCategory: MediaCategory;

  @ManyToOne(() => UsersEntity, (user) => user.id, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;
  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

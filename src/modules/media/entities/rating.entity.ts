import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

import UsersEntity from '../../users/entities/users.entity';
import MediaEntity from './media.entity';

@Entity('ratings')
export default class RatingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int' })
  rating: number;

  @ManyToOne(() => UsersEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: UsersEntity;
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => MediaEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'mediaId' })
  media: MediaEntity;
  @Column({ type: 'uuid' })
  mediaId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

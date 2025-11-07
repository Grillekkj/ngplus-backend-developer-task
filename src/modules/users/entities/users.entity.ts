import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AccountType } from '../enums/account-type.enum';

@Entity('users')
export default class UsersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: 'https://example.com/default-profile.png',
  })
  profilePictureUrl?: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  refreshTokenHash?: string | null;

  @Column({ type: 'enum', enum: AccountType, default: AccountType.USER })
  accountType: AccountType;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'timestamptz', nullable: true })
  lastLogin?: Date | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}

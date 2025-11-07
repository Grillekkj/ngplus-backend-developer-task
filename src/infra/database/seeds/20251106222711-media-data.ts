import { QueryRunner } from 'typeorm';

import { MediaCategory } from 'src/modules/media/enums/category.enum';
import MediaEntity from 'src/modules/media/entities/media.entity';

export const MediaData202511070130Seed = {
  name: 'MediaData202511070130Seed',
  async up(queryRunner: QueryRunner): Promise<any> {
    const mediaData: Partial<MediaEntity>[] = [
      {
        id: '06022e74-2bca-40b6-80de-e66057444163',
        title: 'My First Game',
        description: 'This is a game about adventures.',
        thumbnailUrl: 'https://example.com/images/my-thumbnail1.png',
        contentUrl: 'https://s3.example.com/mybucket/user1/game-file1.zip',
        mediaCategory: MediaCategory.GAME,
        userId: '15b8cd52-22ae-4db4-aab9-335925204850',
      },
      {
        id: '2defac10-1eaa-496a-98be-f5777eae9712',
        title: 'Calm Music Track',
        description: 'A calm relaxing music track.',
        thumbnailUrl: 'https://example.com/images/music-thumb2.png',
        contentUrl: 'https://s3.example.com/mybucket/user3/music2.mp3',
        mediaCategory: MediaCategory.MUSIC,
        userId: 'a936a457-b197-44c9-9f5f-0b5f4de6f71b',
      },
      {
        id: '6c527efa-97ca-4eed-a8f5-611bdd6ca6a3',
        title: 'My Second Game',
        description: 'This game explores puzzles and challenges.',
        thumbnailUrl: 'https://example.com/images/my-thumbnail2.png',
        contentUrl: 'https://s3.example.com/mybucket/user1/game-file2.zip',
        mediaCategory: MediaCategory.GAME,
        userId: '15b8cd52-22ae-4db4-aab9-335925204850',
      },
      {
        id: '7c76ef0a-9d28-4150-9e57-3d69be16e8f0',
        title: 'Gameplay Video',
        description: 'Watch the gameplay highlights.',
        thumbnailUrl: 'https://example.com/images/video-thumb2.png',
        contentUrl: 'https://s3.example.com/mybucket/user4/video2.mp4',
        mediaCategory: MediaCategory.VIDEO,
        userId: '635930e1-406d-4495-8756-deee4e8f1354',
      },
      {
        id: '8b9233dd-e615-4d15-bfaf-d6d556ca2269',
        title: 'Tutorial Video',
        description: 'A video explaining how to play the game.',
        thumbnailUrl: 'https://example.com/images/video-thumb1.png',
        contentUrl: 'https://s3.example.com/mybucket/user4/video1.mp4',
        mediaCategory: MediaCategory.VIDEO,
        userId: '635930e1-406d-4495-8756-deee4e8f1354',
      },
      {
        id: 'cf9388c8-7e0d-4cc2-86d5-478a70999682',
        title: 'Amazing Artwork',
        description: 'A beautiful piece of digital art.',
        thumbnailUrl: 'https://example.com/images/artwork-thumb1.png',
        contentUrl: 'https://s3.example.com/mybucket/user2/artwork1.png',
        mediaCategory: MediaCategory.ARTWORK,
        userId: '38183bdb-b8c9-43c8-866f-26d96621e4b3',
      },
      {
        id: 'e4ec41dd-2f20-4d7b-9d82-9d13a6d37c78',
        title: 'Colorful Illustration',
        description: 'An illustration full of colors.',
        thumbnailUrl: 'https://example.com/images/artwork-thumb2.png',
        contentUrl: 'https://s3.example.com/mybucket/user2/artwork2.png',
        mediaCategory: MediaCategory.ARTWORK,
        userId: '38183bdb-b8c9-43c8-866f-26d96621e4b3',
      },
      {
        id: 'faca9c0f-5986-4b0e-a3f3-ffefcb0c8ebb',
        title: 'Epic Music Track',
        description: 'An epic track for games or videos.',
        thumbnailUrl: 'https://example.com/images/music-thumb1.png',
        contentUrl: 'https://s3.example.com/mybucket/user3/music1.mp3',
        mediaCategory: MediaCategory.MUSIC,
        userId: 'a936a457-b197-44c9-9f5f-0b5f4de6f71b',
      },
    ];

    const mediaEntities = mediaData.map((data) => {
      const m = new MediaEntity();
      Object.assign(m, data);
      return m;
    });

    await queryRunner.manager.save(mediaEntities);
  },
};

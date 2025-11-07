import { QueryRunner } from 'typeorm';

import RatingEntity from 'src/modules/media/entities/rating.entity';

export const RatingData20251106230232Seed = {
  name: 'RatingData20251106230232',
  async up(queryRunner: QueryRunner): Promise<any> {
    const ratingsData: Partial<RatingEntity>[] = [
      // john_doe - 15b8cd52-22ae-4db4-aab9-335925204850
      {
        id: '10addf07-256d-4e15-9632-20f31ea3b73b',
        rating: 1,
        userId: '15b8cd52-22ae-4db4-aab9-335925204850',
        mediaId: 'cf9388c8-7e0d-4cc2-86d5-478a70999682',
      },
      {
        id: '61cf7893-2997-4ecb-b8bc-7eee9dde82fe',
        rating: 2,
        userId: '15b8cd52-22ae-4db4-aab9-335925204850',
        mediaId: '2defac10-1eaa-496a-98be-f5777eae9712',
      },
      {
        id: 'bb68bedc-5d9e-46fd-ac79-1d5a15d0102a',
        rating: 4,
        userId: '15b8cd52-22ae-4db4-aab9-335925204850',
        mediaId: '7c76ef0a-9d28-4150-9e57-3d69be16e8f0',
      },

      // ngplus - 38183bdb-b8c9-43c8-866f-26d96621e4b3
      {
        id: '1826e040-ca8d-4307-a48b-77459b696daa',
        rating: 1,
        userId: '38183bdb-b8c9-43c8-866f-26d96621e4b3',
        mediaId: '2defac10-1eaa-496a-98be-f5777eae9712',
      },
      {
        id: '37b9415a-99c5-46da-874c-bfd14ee089c6',
        rating: 5,
        userId: '38183bdb-b8c9-43c8-866f-26d96621e4b3',
        mediaId: '6c527efa-97ca-4eed-a8f5-611bdd6ca6a3',
      },
      {
        id: 'd3489769-152f-42c8-be70-768127ce563e',
        rating: 3,
        userId: '38183bdb-b8c9-43c8-866f-26d96621e4b3',
        mediaId: '06022e74-2bca-40b6-80de-e66057444163',
      },

      // hr - a936a457-b197-44c9-9f5f-0b5f4de6f71b
      {
        id: '1ebd61b7-effc-4298-998f-d462f44a508f',
        rating: 1,
        userId: 'a936a457-b197-44c9-9f5f-0b5f4de6f71b',
        mediaId: '6c527efa-97ca-4eed-a8f5-611bdd6ca6a3',
      },
      {
        id: '59f129f7-d76d-421b-9771-c8685404d132',
        rating: 3,
        userId: 'a936a457-b197-44c9-9f5f-0b5f4de6f71b',
        mediaId: '7c76ef0a-9d28-4150-9e57-3d69be16e8f0',
      },
      {
        id: 'c2a52f7e-7af0-486c-8e7e-f12e06150f9b',
        rating: 4,
        userId: 'a936a457-b197-44c9-9f5f-0b5f4de6f71b',
        mediaId: 'e4ec41dd-2f20-4d7b-9d82-9d13a6d37c78',
      },

      // joao_victor - 635930e1-406d-4495-8756-deee4e8f1354
      {
        id: '1edfcb5c-f97a-4f44-ba41-1cee73822329',
        rating: 5,
        userId: '635930e1-406d-4495-8756-deee4e8f1354',
        mediaId: 'faca9c0f-5986-4b0e-a3f3-ffefcb0c8ebb',
      },
      {
        id: 'c38b142b-222b-4fab-beee-ac627ce454bd',
        rating: 3,
        userId: '635930e1-406d-4495-8756-deee4e8f1354',
        mediaId: 'cf9388c8-7e0d-4cc2-86d5-478a70999682',
      },
      {
        id: 'c825c41e-ed45-4a95-8e5a-4a3ed5ebc6d4',
        rating: 2,
        userId: '635930e1-406d-4495-8756-deee4e8f1354',
        mediaId: '06022e74-2bca-40b6-80de-e66057444163',
      },
    ];

    const ratingEntities = ratingsData.map((data) => {
      const r = new RatingEntity();
      Object.assign(r, data);
      return r;
    });

    await queryRunner.manager.save(ratingEntities);
  },
};

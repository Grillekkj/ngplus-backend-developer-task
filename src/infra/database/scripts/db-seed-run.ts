import { Repository, QueryRunner } from 'typeorm';
import * as path from 'node:path';
import * as fs from 'node:fs';

import { connectionSource } from 'src/common/configs/typeorm';
import Seeder from '../entities/seeder.entity';

async function run() {
  await connectionSource.initialize();
  const queryRunner = connectionSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const seedRepository = connectionSource.getRepository(Seeder);

    const seedsFolder = path.resolve(__dirname, '..', 'seeds');

    const seedFiles = fs
      .readdirSync(seedsFolder)
      .filter((file) => file.endsWith('.ts') && file !== 'seedRun.ts');

    for (const seedFile of seedFiles) {
      const seedModule = Object.values(
        await import(path.join(seedsFolder, seedFile)),
      )[0] as {
        name: string;
        up(queryRunner: QueryRunner): Promise<any>;
      };

      if (await seedNotExecuted(seedRepository, seedModule.name)) {
        await seedModule.up(queryRunner);
        await seedRepository.insert({
          name: seedModule.name,
          timestamp: Date.now(),
        });
        console.log(`${seedModule.name} executed!`);
      }
    }

    await queryRunner.commitTransaction();
  } catch (err) {
    console.error('Error during execution:', err);
    await queryRunner.rollbackTransaction();
    throw err;
  } finally {
    await queryRunner.release();
  }
}

async function seedNotExecuted(
  seedRepository: Repository<Seeder>,
  seedName: string,
): Promise<boolean> {
  const existingSeed = await seedRepository.findOne({
    where: { name: seedName },
  });
  return !existingSeed;
}

run();

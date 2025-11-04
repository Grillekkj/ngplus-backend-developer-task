import { exec } from 'node:child_process';

const migrationName = process.argv.at(-1);

if (!migrationName) {
  console.error('Error: migration name is required.');
  process.exit(1);
}

exec(
  `typeorm-ts-node-commonjs -d ./src/common/configs/typeorm.ts migration:generate ./src/infra/database/migrations/${migrationName}`,
  (err, stdout, stderr) => {
    if (err) {
      console.error('Error generating migration:', err);
      return;
    }
    if (stderr) {
      console.error('STDERR:', stderr);
    }
    console.log(stdout);
  },
);

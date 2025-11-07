import * as path from 'node:path';
import { format } from 'date-fns';
import * as fs from 'node:fs';

import { toKebabCase, toPascalCase } from 'src/utils/to-case';

async function create() {
  const seedName = process.argv.at(-1);

  if (!seedName || seedName.endsWith('.ts')) {
    console.error('Error: seed name is required.');
    console.log('Example usage: npm run seed:create users-data');
    process.exit(1);
  }

  const timestamp = format(new Date(), 'yyyyMMddHHmmss');
  const fileNameKebabCase = `${timestamp}-${toKebabCase(seedName)}.ts`;
  const fileNamePascalCase = `${toPascalCase(seedName)}${timestamp}`;
  const filePath = path.resolve(
    __dirname,
    '..',
    'seeds',
    `${fileNameKebabCase}`,
  );

  const seedContent = `import { QueryRunner } from 'typeorm'

export const ${fileNamePascalCase}Seed = {
  name: '${fileNamePascalCase}',
  async up(queryRunner: QueryRunner): Promise<any> {
    // Your logic here
  }
};
`;

  fs.writeFileSync(filePath, seedContent);
  console.log(`Seed file created: ${fileNameKebabCase}`);
}

create();

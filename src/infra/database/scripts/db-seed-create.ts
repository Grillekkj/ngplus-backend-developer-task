import * as path from 'node:path';
import { format } from 'date-fns';
import * as yargs from 'yargs';
import * as fs from 'node:fs';

import { toKebabCase, toPascalCase } from 'src/utils/to-case';

async function create() {
  const argv = await yargs.option('name', {
    alias: 'n',
    description: 'Seed name',
    type: 'string',
    demandOption: true,
  }).argv;

  const seedName = argv.name;

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

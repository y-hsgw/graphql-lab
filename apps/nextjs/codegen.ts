import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

const config: CodegenConfig = {
  schema: '../nestjs/src/schema.gql',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/lib/gql/': {
      preset: 'client',
      presetConfig: {
        persistedDocuments: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: 'prettier --write',
  },
};
export default config;

import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

const config: CodegenConfig = {
  schema: process.env.NESTJS_API,
  documents: ['src/**/*.tsx'],
  generates: {
    './src/lib/gql/': {
      preset: 'client',
      presetConfig: {
        persistedDocuments: true,
      },
    },
  },
};
export default config;

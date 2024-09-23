import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:8080/graphql',
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

import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://trygql.formidable.dev/graphql/basic-pokedex',
  documents: ['src/**/*.tsx'],
  generates: {
    './src/lib/gql/': {
      preset: 'client',
    },
  },
};
export default config;

import { Module } from '@nestjs/common';
import { join } from 'node:path';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, type MercuriusDriverConfig } from '@nestjs/mercurius';
import { AuthorsModule } from './authors/authors.module.js';
import persistedQueries from './persisted-documents.json' assert { type: 'json' };

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      onlyPersisted: true,
      persistedQueries,
    }),
    AuthorsModule,
  ],
})
export class AppModule {}

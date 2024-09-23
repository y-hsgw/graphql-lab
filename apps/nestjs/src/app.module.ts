import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, type MercuriusDriverConfig } from '@nestjs/mercurius';
import { AuthorsModule } from './authors/authors.module.js';
import mercurius from 'mercurius';
import persistedQueries from '../persisted-documents.json' assert { type: 'json' };

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      persistedQueries,
      persistedQueryProvider:
        mercurius.persistedQueryDefaults.prepared(persistedQueries),
    }),
    AuthorsModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, MercuriusDriverConfig } from '@nestjs/mercurius';
import { AuthorsModule } from './authors/authors.module.js';

@Module({
  imports: [
    GraphQLModule.forRoot<MercuriusDriverConfig>({
      driver: MercuriusDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
    }),
    AuthorsModule,
  ],
})
export class AppModule {}

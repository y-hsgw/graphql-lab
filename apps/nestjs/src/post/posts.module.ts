import { Module } from '@nestjs/common';
import { PostsService } from './posts.service.js';

@Module({
  exports: [PostsService],
  providers: [PostsService],
})
export class PostsModule {}

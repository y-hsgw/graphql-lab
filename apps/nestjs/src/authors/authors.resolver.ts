import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Author } from './models/author.model.js';
import { AuthorsService } from './authors.service.js';
import { PostsService } from '../post/posts.service.js';
import { Post } from '../post/models/post.model.js';
import { GetAuthorArgs } from './dto/get-author-args.js';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(
    private authorsService: AuthorsService,
    private postsService: PostsService,
  ) {}

  @Query(() => Author, { name: 'author', description: '著者', nullable: true })
  getAuthor(@Args() { id }: GetAuthorArgs) {
    return this.authorsService.findOneById(id);
  }

  @ResolveField('posts', () => [Post], { description: '投稿リスト' })
  getPosts(@Parent() author: Author) {
    const { id } = author;
    return this.postsService.findAll({ authorId: id });
  }
}

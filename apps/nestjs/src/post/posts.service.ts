import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  #posts = [
    { id: 1, authorId: 1, title: 'weather', votes: 12 },
    { id: 2, authorId: 1, title: 'sea' },
    { id: 3, authorId: 2, title: 'forest' },
  ];

  findOne(id: number) {
    return this.#posts.find((post) => post.id === id);
  }

  findAll(option?: { authorId: number }) {
    return this.#posts.filter((post) => post.authorId === option?.authorId);
  }

  upvoteById(option: { id: number }) {
    const newPosts = this.#posts.map((post) =>
      post.id === option.id
        ? {
            ...post,
            votes: (post.votes ?? 0) + 1,
          }
        : post,
    );
    this.#posts = newPosts;
  }
}

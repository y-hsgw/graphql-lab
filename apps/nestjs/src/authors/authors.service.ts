import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorsService {
  #authors = [
    { id: 1, firstName: 'tanaka', lastName: 'tatuya' },
    { id: 2, firstName: 'matsunagane', lastName: 'yuto' },
  ];

  findOneById(id: number) {
    return this.#authors.find((author) => author.id === id);
  }
}

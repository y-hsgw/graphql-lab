import { Field, ArgsType, Int } from '@nestjs/graphql';
import { PaginationArgs } from '../../shared/dto/pagination.args.js';

@ArgsType()
export class GetAuthorArgs extends PaginationArgs {
  @Field(() => Int)
  id!: number;
}

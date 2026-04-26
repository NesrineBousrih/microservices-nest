import { Resolver, Query, ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { QueryService } from './query.service';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;
}

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly queryService: QueryService) {}

  @Query(() => [Product])
  async products() {
    return this.queryService.getProducts();
  }
}
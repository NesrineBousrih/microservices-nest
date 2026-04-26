import { Resolver, Query, Args, ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { QueryService } from './query.service';

@ObjectType()
export class Order {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  productId: number;

  @Field(() => Int)
  quantity: number;

  @Field()
  status: string;

  @Field()
  customerEmail: string;
}

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly queryService: QueryService) {}

  @Query(() => [Order])
  async orders() {
    return this.queryService.getOrders();
  }

  @Query(() => Order, { nullable: true })
  async orderById(@Args('id') id: number) {
    return this.queryService.getOrderById(id);
  }
}
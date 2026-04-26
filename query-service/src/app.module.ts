import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { QueryService } from './query.service';
import { ProductsResolver } from './products.resolver';
import { OrdersResolver } from './orders.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
  ],
  providers: [QueryService, ProductsResolver, OrdersResolver],
})
export class AppModule {}
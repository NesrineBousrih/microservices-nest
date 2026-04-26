import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders.module';
import { Order } from './order.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'orders.db',
      entities: [Order],
      synchronize: true,
    }),
    OrdersModule,
  ],
})
export class AppModule {}
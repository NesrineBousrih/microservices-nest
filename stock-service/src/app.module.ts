import { Module } from '@nestjs/common';
import { StockModule } from './stock.module';

@Module({
  imports: [StockModule],
})
export class AppModule {}
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { StockService } from './stock.service';

@Controller()
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @GrpcMethod('StockService', 'CheckAndReserve')
  checkAndReserve(data: { productId: number; quantity: number }) {
    return this.stockService.checkAndReserve(data.productId, data.quantity);
  }
}
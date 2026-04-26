import { Injectable } from '@nestjs/common';

@Injectable()
export class StockService {
  private stock: Map<number, number> = new Map([
    [1, 10],
    [2, 50],
    [3, 5],
  ]);

  checkAndReserve(productId: number, quantity: number): { available: boolean; message: string } {
    const current = this.stock.get(productId);

    if (current === undefined) {
      return { available: false, message: `Product #${productId} not found in stock` };
    }

    if (current < quantity) {
      return { available: false, message: `Not enough stock. Available: ${current}, requested: ${quantity}` };
    }

    this.stock.set(productId, current - quantity);
    return { available: true, message: `Reserved ${quantity} units of product #${productId}` };
  }
}
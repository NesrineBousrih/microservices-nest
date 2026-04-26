import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
  sendConfirmation(data: any) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Confirmation sent to ${data.customerEmail} for order #${data.orderId}`);
    console.log(`Details: product #${data.productId}, quantity: ${data.quantity}, status: ${data.status}`);
  }
}
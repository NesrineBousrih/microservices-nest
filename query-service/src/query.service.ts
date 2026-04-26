import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class QueryService {
  private catalogUrl = 'http://localhost:3001';
  private orderUrl = 'http://localhost:3002';

  async getProducts() {
    const res = await axios.get(`${this.catalogUrl}/products`);
    return res.data;
  }

  async getOrders() {
    const res = await axios.get(`${this.orderUrl}/orders`);
    return res.data;
  }

  async getOrderById(id: number) {
    const res = await axios.get(`${this.orderUrl}/orders/${id}`);
    return res.data;
  }
}
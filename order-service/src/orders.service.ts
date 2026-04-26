import { Injectable, BadRequestException, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ClientGrpc } from '@nestjs/microservices';
import { Client, Transport } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';
import { join } from 'path';
import { Order } from './order.entity';
import { CreateOrderDto } from './create-order.dto';
import { firstValueFrom } from 'rxjs';

interface StockResponse {
  available: boolean;
  message: string;
}

interface StockServiceGrpc {
  checkAndReserve(data: { productId: number; quantity: number }): any;
}

@Injectable()
export class OrdersService implements OnModuleInit, OnModuleDestroy {
  @Client({
    transport: Transport.GRPC,
    options: {
      package: 'stock',
      protoPath: join(__dirname, '../src/proto/stock.proto'),
      url: 'localhost:5001',
    },
  })
  private client: ClientGrpc;

  private stockService: StockServiceGrpc;

  private kafka = new Kafka({ brokers: ['localhost:9092'] });
  private producer = this.kafka.producer();

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async onModuleInit() {
    this.stockService = this.client.getService<StockServiceGrpc>('StockService');
    await this.producer.connect();
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { productId, quantity, customerEmail } = createOrderDto;

    const stockResult = await firstValueFrom<StockResponse>(
      this.stockService.checkAndReserve({ productId, quantity }),
    );

    if (!stockResult.available) {
      throw new BadRequestException(stockResult.message);
    }

    const order = this.ordersRepository.create({
      productId,
      quantity,
      customerEmail,
      status: 'CONFIRMED',
    });

    const saved = await this.ordersRepository.save(order);

    await this.producer.send({
      topic: 'order.created',
      messages: [
        {
          value: JSON.stringify({
            orderId: saved.id,
            productId,
            quantity,
            customerEmail,
            status: saved.status,
          }),
        },
      ],
    });

    return saved;
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: number): Promise<Order | null> {
    return this.ordersRepository.findOneBy({ id });
  }
}
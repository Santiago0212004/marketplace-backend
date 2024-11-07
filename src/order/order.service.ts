import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { User } from '../user/entity/user.entity';
import { Order } from './entity/order.entity';
import { Option } from '../option/entity/option.entity';
import { UserService } from '../user/user.service';
import { OrderDto } from './dto/order.dto';
import { CurrentUserDto } from '../common/currentUser.dto';
import { Size } from '../size/entity/size.entity';
import { Product } from '../product/entity/product.entity';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,

    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly userService: UserService
  ) {}

  async create(createOrderDto: CreateOrderDto, buyer: CurrentUserDto): Promise<Order> {
    const { optionId, amount } = createOrderDto;
    const buyerId = buyer.userId;
    const createdDate = new Date();

    try {
          const option = await this.optionRepository.findOne({
            where: { id: optionId },
            relations: ['size', 'size.product']
          });
          if (!option) {
              throw new NotFoundException(`Option with ID ${optionId} not found`);
          }

          const buyer = await this.userRepository.findOne({
              where: { id: buyerId }
          });
          if (!buyer) {
              throw new NotFoundException(`Buyer with ID ${buyerId} not found`);
          }

          if (option.availableUnits < amount ) {
              throw new ConflictException('No available units for this option');
          }

          const totalPrice = option.size.product.price * amount;

          const newOrder = this.orderRepository.create({
              createdDate,
              buyer,
              option,
              amount,
              totalPrice
          });

          await this.optionRepository.update(optionId, { availableUnits: option.availableUnits - amount });

          return await this.orderRepository.save(newOrder);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException('An unexpected error occurred while creating the order');
      }
    }
  }

  async getAll(): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        relations: ['option','buyer']
      });
    } catch {
      throw new InternalServerErrorException('An unexpected error occurred while retrieving orders');
    }
  }

  async delete(id: string): Promise<void> {
    const order = await this.orderRepository.findOne({where: {id}});
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    await this.orderRepository.delete(order.id);
  }

  async getOrdersBySeller(seller: CurrentUserDto): Promise<OrderDto[]> {
    try {
      const orders = await this.orderRepository.find({
        where: { option: { size: { product: { seller: { id: seller.userId } } } } },
        relations: ['option', 'option.size', 'option.size.product', 'option.size.product.seller', 'buyer']
      });
      return this.mapOrders(orders);
    } catch {
      throw new InternalServerErrorException('An unexpected error occurred while retrieving orders by seller');
    }
  }

  async getOrdersByBuyer(seller: CurrentUserDto): Promise<OrderDto[]> {
    try {
      const orders = await this.orderRepository.find({
        where: { buyer: { id: seller.userId } },
        relations: ['option', 'option.size', 'option.size.product', 'option.size.product.seller', 'buyer']
      });
      return this.mapOrders(orders);
    } catch {
      throw new InternalServerErrorException('An unexpected error occurred while retrieving orders by buyer');
    }
  }

  mapOrders(orders: Order[]): OrderDto[] {
    return orders.map((order): OrderDto => {
      return {
        id: order.id,
        createdDate: order.createdDate,
        totalPrice: order.option.size.product.price * order.amount,
        amount: order.amount,
        optionDescription: order.option.description,
        optionImageUrl: order.option.imageUrl,
        sizeName: order.option.size.name,
        buyerName: order.buyer.fullName,
        productName: order.option.size.product.name,
        productPrice: order.option.size.product.price,
        sellerEmail: order.option.size.product.seller.email,
        sellerName: order.option.size.product.seller.fullName,
        buyerEmail: order.buyer.email,
        productId: order.option.size.product.id
      };
    });
  }
}

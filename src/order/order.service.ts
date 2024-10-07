import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { User } from '../user/entity/user.entity';
import { Order } from './entity/order.entity';
import { Option } from '../option/entity/option.entity';
import { Unit } from '../unit/entity/unit.entity';
import { UserService } from '../user/user.service';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,

    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
    
    private readonly userService: UserService
  ) {}

  async create(createOrderDto: CreateOrderDto, @Request() req): Promise<Order> {
    const {optionId } = createOrderDto;
    const buyer = await this.userService.getProfile(req);
    const buyerId = buyer.id;
    const createdDate = new Date();

    try {
          const option = await this.optionRepository.findOne({ where: { id: optionId } });
          if (!option) {
              throw new NotFoundException(`Option with ID ${option} not found`);
          }

          const buyer = await this.userRepository.findOne({ 
              where: { id: buyerId }
          });
          if (!buyer) {
              throw new NotFoundException(`Seller with ID ${buyerId} not found`);
          }

          const availableUnit = await this.unitRepository.findOne({
            where: { option: { id: optionId }, sold: false }
          });

          if (!availableUnit) {
            throw new ConflictException('No available units for this option');
          }else {
            availableUnit.sold = true;
            await this.unitRepository.save(availableUnit);
          }

          const newOrder = this.orderRepository.create({
          createdDate,
          buyer,
          option
          });

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

  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: { option: { size: { product: { seller: { id: sellerId } } } } },
        relations: ['option', 'option.size', 'option.size.product', 'option.size.product.seller']
      });
    } catch {
      throw new InternalServerErrorException('An unexpected error occurred while retrieving orders by seller');
    }
  }

  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    try {
      return await this.orderRepository.find({
        where: { buyer: { id: buyerId } },
        relations: ['option']
      });
    } catch {
      throw new InternalServerErrorException('An unexpected error occurred while retrieving orders by buyer');
    }
  }

}
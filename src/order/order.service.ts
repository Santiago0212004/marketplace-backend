import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/createOrder.dto';
import { User } from 'src/user/entity/user.entity';
import { CurrentUserService } from 'src/common/currentUser.service';
import { Order } from './entity/order.entity';
import { Option } from 'src/option/entity/option.entity';
import { Unit } from 'src/unit/entity/unit.entity';


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
    
    private readonly currentUserService: CurrentUserService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const {optionId } = createOrderDto;
    const buyerId = this.currentUserService.getCurrentUserId();
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
        relations: ['option']
      });
    } catch {
      throw new InternalServerErrorException('An unexpected error occurred while retrieving orders');
    }
  }
}
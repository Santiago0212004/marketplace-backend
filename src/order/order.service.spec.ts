import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entity/order.entity';
import { User } from '../user/entity/user.entity';
import { Option } from '../option/entity/option.entity';
import { Unit } from '../unit/entity/unit.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UserService } from '../user/user.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: Repository<Order>;
  let userRepository: Repository<User>;
  let optionRepository: Repository<Option>;
  let unitRepository: Repository<Unit>;
  let userService: UserService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockOptionRepository = {
    findOne: jest.fn(),
  };

  const mockUnitRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockUserService = {
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Option),
          useValue: mockOptionRepository,
        },
        {
          provide: getRepositoryToken(Unit),
          useValue: mockUnitRepository,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(getRepositoryToken(Order));
    userRepository = module.get(getRepositoryToken(User));
    optionRepository = module.get(getRepositoryToken(Option));
    unitRepository = module.get(getRepositoryToken(Unit));
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    const createOrderDto = { optionId: 'option-id' };
    const buyer = { id: 'buyer-id' } as User;
    const option = { id: 'option-id' } as Option;
    const availableUnit = { sold: false } as Unit;
    const createdDate = new Date();
    const mockOrder = { id: 'order-id', createdDate, buyer, option } as Order;

    it('should create an order', async () => {
      jest.spyOn(userService, 'getProfile').mockResolvedValue(buyer);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(buyer);
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(option);
      jest.spyOn(unitRepository, 'findOne').mockResolvedValue(availableUnit);
      jest.spyOn(unitRepository, 'save').mockResolvedValue({ ...availableUnit, sold: true });
      jest.spyOn(orderRepository, 'create').mockReturnValue(mockOrder);
      jest.spyOn(orderRepository, 'save').mockResolvedValue(mockOrder);

      const req = { user: { id: 'buyer-id' } };
      const result = await service.create(createOrderDto, req);

      expect(result).toEqual(mockOrder);
      expect(userService.getProfile).toHaveBeenCalledWith(req);
      expect(userRepository.findOne).toHaveBeenCalledWith({ where: { id: 'buyer-id' } });
      expect(optionRepository.findOne).toHaveBeenCalledWith({ where: { id: createOrderDto.optionId } });
      expect(unitRepository.findOne).toHaveBeenCalledWith({ where: { option: { id: createOrderDto.optionId }, sold: false } });
      expect(unitRepository.save).toHaveBeenCalledWith({ ...availableUnit, sold: true });
      expect(orderRepository.save).toHaveBeenCalledWith(mockOrder);
    });

    it('should throw NotFoundException if option not found', async () => {
      jest.spyOn(userService, 'getProfile').mockResolvedValue(buyer);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(buyer);
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(null);

      const req = { user: { id: 'buyer-id' } };
      await expect(service.create(createOrderDto, req)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if buyer not found', async () => {
      jest.spyOn(userService, 'getProfile').mockResolvedValue(buyer);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const req = { user: { id: 'buyer-id' } };
      await expect(service.create(createOrderDto, req)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if no available units', async () => {
      jest.spyOn(userService, 'getProfile').mockResolvedValue(buyer);
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(buyer);
      jest.spyOn(optionRepository, 'findOne').mockResolvedValue(option);
      jest.spyOn(unitRepository, 'findOne').mockResolvedValue(null);

      const req = { user: { id: 'buyer-id' } };
      await expect(service.create(createOrderDto, req)).rejects.toThrow(ConflictException);
    });
  });

  describe('getAll', () => {
    it('should return all orders', async () => {
      const mockOrders = [{ id: 'order-1' }, { id: 'order-2' }] as Order[];
      jest.spyOn(orderRepository, 'find').mockResolvedValue(mockOrders);

      const result = await service.getAll();

      expect(result).toEqual(mockOrders);
      expect(orderRepository.find).toHaveBeenCalledWith({
        relations: ['option', 'buyer']
      });
    });
  });

  describe('delete', () => {
    it('should delete an order', async () => {
      const orderId = 'order-id';
      const mockOrder = { id: orderId } as Order;
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(mockOrder);
      jest.spyOn(orderRepository, 'delete').mockResolvedValue(undefined);

      await service.delete(orderId);

      expect(orderRepository.findOne).toHaveBeenCalledWith({ where: { id: orderId } });
      expect(orderRepository.delete).toHaveBeenCalledWith(orderId);
    });

    it('should throw NotFoundException if order not found', async () => {
      const orderId = 'non-existent-id';
      jest.spyOn(orderRepository, 'findOne').mockResolvedValue(null);

      await expect(service.delete(orderId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOrdersBySeller', () => {
    it('should return orders for a specific seller', async () => {
      const sellerId = 'seller-id';
      const mockOrders = [{ id: 'order-1' }, { id: 'order-2' }] as Order[];
      jest.spyOn(orderRepository, 'find').mockResolvedValue(mockOrders);

      const result = await service.getOrdersBySeller(sellerId);

      expect(result).toEqual(mockOrders);
      expect(orderRepository.find).toHaveBeenCalledWith({
        where: { option: { size: { product: { seller: { id: sellerId } } } } },
        relations: ['option', 'option.size', 'option.size.product', 'option.size.product.seller']
      });
    });
  });

  describe('getOrdersByBuyer', () => {
    it('should return orders for a specific buyer', async () => {
      const buyerId = 'buyer-id';
      const mockOrders = [{ id: 'order-1' }, { id: 'order-2' }] as Order[];
      jest.spyOn(orderRepository, 'find').mockResolvedValue(mockOrders);

      const result = await service.getOrdersByBuyer(buyerId);

      expect(result).toEqual(mockOrders);
      expect(orderRepository.find).toHaveBeenCalledWith({
        where: { buyer: { id: buyerId } },
        relations: ['option']
      });
    });
  });
});
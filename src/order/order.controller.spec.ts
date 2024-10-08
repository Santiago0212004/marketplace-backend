import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Order } from './entity/order.entity';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    create: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
    getOrdersBySeller: jest.fn(),
    getOrdersByBuyer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  describe('create', () => {
    const createOrderDto: CreateOrderDto = { optionId: 'option-id' };
    const mockOrder: Order = { id: 'order-id', createdDate: new Date(), buyer: null, option: null };

    it('should create an order', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockOrder);

      const req = { user: { id: 'buyer-id' } };
      const result = await controller.create(createOrderDto, req);

      expect(result).toEqual(mockOrder);
      expect(service.create).toHaveBeenCalledWith(createOrderDto, req);
    });
  });

  describe('delete', () => {
    const orderId = 'order-id';

    it('should delete an order', async () => {
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      await controller.delete(orderId);

      expect(service.delete).toHaveBeenCalledWith(orderId);
    });
  });

  describe('getAll', () => {
    const mockOrders: Order[] = [{ id: 'order-id', createdDate: new Date(), buyer: null, option: null }];

    it('should return all orders', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue(mockOrders);

      const result = await controller.getAll();

      expect(result).toEqual(mockOrders);
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getOrdersBySeller', () => {
    const sellerId = 'seller-id';
    const mockOrders: Order[] = [{ id: 'order-id', createdDate: new Date(), buyer: null, option: null }];

    it('should return orders by seller', async () => {
      jest.spyOn(service, 'getOrdersBySeller').mockResolvedValue(mockOrders);

      const result = await controller.getOrdersBySeller(sellerId);

      expect(result).toEqual(mockOrders);
      expect(service.getOrdersBySeller).toHaveBeenCalledWith(sellerId);
    });
  });

  describe('getOrdersByBuyer', () => {
    const buyerId = 'buyer-id';
    const mockOrders: Order[] = [{ id: 'order-id', createdDate: new Date(), buyer: null, option: null }];

    it('should return orders by buyer', async () => {
      jest.spyOn(service, 'getOrdersByBuyer').mockResolvedValue(mockOrders);

      const result = await controller.getOrdersByBuyer(buyerId);

      expect(result).toEqual(mockOrders);
      expect(service.getOrdersByBuyer).toHaveBeenCalledWith(buyerId);
    });
  });
});

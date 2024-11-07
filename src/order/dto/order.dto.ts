export class OrderDto {
  id: string;
  createdDate: Date;
  totalPrice: number;
  amount: number;

  optionDescription: string;
  optionImageUrl: string;

  sizeName: string;

  buyerName: string;
  buyerEmail: string;

  sellerName: string;
  sellerEmail: string;

  productName: string;
  productPrice: number;
  productId:string
}
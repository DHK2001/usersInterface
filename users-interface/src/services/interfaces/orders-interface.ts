import { Product } from "./products-interfaces";
import { User } from "./users-interfaces";

export interface CreateOrderDto {
  userId: string;
  products: { id: string; amount: number }[];
}

export interface UpdateOrderDto {
  products: { id: string; amount: number }[];
}

export interface OrderResponse {
  id: string;
  userId: string;
  products: { id: string; name: string; amount: number }[];
  totalAmount: number;
  orderDate: Date;
  finalized: boolean;
}

export interface DeleteOrderResponse {
  deleted: boolean;
  message: string;
}

export interface FinalizedOrderResponse {
  finilized: boolean;
  message: string;
}

export interface Order {
  id: string;
  userId: string;
  products: { id: string; name: string; amount: number }[];
  totalAmount: number;
  orderDate: Date;
  finalized: boolean;
}

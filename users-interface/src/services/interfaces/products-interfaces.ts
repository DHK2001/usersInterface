export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface UpdateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface deleteProductResponse {
  deleteUser: boolean;
  message: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

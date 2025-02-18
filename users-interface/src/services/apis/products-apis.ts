import { CreateProductDto, deleteProductResponse, Product, UpdateProductDto } from "../interfaces/products-interfaces";

const productsUrl = "http://localhost:8083/v1/products";

export const fetchAllProducts = async (
  token: string
): Promise<{
  status: number;
  data: Product[] | null;
}> => {
  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(productsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
      },
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const createProduct = async (
  token: string,
  product: CreateProductDto
): Promise<{ message: string, status: number; data: Product | null }> => {
  try {
    const response = await fetch(productsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
      },
      body: JSON.stringify(product),
    });

    const status = response.status;
    const message = response.statusText;

    if (!response.ok) {
      return { message, status, data: null };
    }

    const data = await response.json();
    return { message, status, data };
  } catch (error) {
    return { message: "", status: 500, data: null };
  }
};

export const fetchIdProduct = async (
  token: string,
  id: String
): Promise<{ status: number; data: Product | null }> => {
  const url = `${productsUrl}/${id}`;

  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
      },
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const updateProduct = async (
  token: string,
  id: String,
  user: UpdateProductDto
): Promise<{ status: number; data: Product | null }> => {
  const url = `${productsUrl}/${id}`;

  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
      },
      body: JSON.stringify(user),
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};

export const deleteProduct = async (
  token: string,
  id: String
): Promise<{ status: number; data: deleteProductResponse | null }> => {
  const url = `${productsUrl}/${id}`;

  if (!token) {
    throw new Error("API key not found");
  }

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
      },
    });

    const status = response.status;

    if (!response.ok) {
      return { status, data: null };
    }

    const data = await response.json();
    return { status, data };
  } catch (error) {
    return { status: 500, data: null };
  }
};
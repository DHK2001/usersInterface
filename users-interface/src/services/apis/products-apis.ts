import { Product } from "../interfaces/products-interfaces";

const productsUrl = "http://localhost:8083/v1/products";

export const fetchAllProducts = async (token: string): Promise<{
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
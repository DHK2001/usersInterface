import {
  CreateOrderDto,
  DeleteOrderResponse,
  FinalizedOrderResponse,
  Order,
  UpdateOrderDto,
} from "@/models/orders";
import { dbs } from "@/store";
import { authorizationNotFound } from "@/utils/messages";

const MONGO_URL = process.env.MONGO_URL;
const MSSQL_URL = process.env.MSSQL_URL;

var ordersUrl = "";

if (MONGO_URL && MSSQL_URL) {
  if (dbs === "mongo") {
    ordersUrl = MONGO_URL + "/orders";
  } else {
    ordersUrl = MSSQL_URL + "/orders";
  }
}

export const fetchAllOrders = async (
  token: string,
  id: string
): Promise<{
  status: number;
  data: Order[] | null;
}> => {
  if (!token) {
    throw new Error(authorizationNotFound);
  }

  try {
    const url = `${ordersUrl}/ordersUser/${id}`;
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

export const fetchIdOrder = async (
  token: string,
  id: String
): Promise<{ status: number; data: Order | null }> => {
  const url = `${ordersUrl}/${id}`;

  if (!token) {
    throw new Error(authorizationNotFound);
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

export const createOrder = async (
  token: string,
  order: CreateOrderDto
): Promise<{ message: string; status: number; data: Order | null }> => {
  try {
    const response = await fetch(ordersUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
      },
      body: JSON.stringify(order),
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

export const updateOrder = async (
  token: string,
  id: String,
  order: UpdateOrderDto
): Promise<{ status: number; data: Order | null }> => {
  const url = `${ordersUrl}/${id}`;

  if (!token) {
    throw new Error(authorizationNotFound);
  }

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "authorization-token": token,
      },
      body: JSON.stringify(order),
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

export const deleteOrder = async (
  token: string,
  id: String
): Promise<{ status: number; data: DeleteOrderResponse | null }> => {
  const url = `${ordersUrl}/${id}`;

  if (!token) {
    throw new Error(authorizationNotFound);
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

export const finalizeOrder = async (
  token: string,
  id: String
): Promise<{ status: number; data: FinalizedOrderResponse | null }> => {
  const url = `${ordersUrl}/${id}/finalize`;

  if (!token) {
    throw new Error(authorizationNotFound);
  }

  try {
    const response = await fetch(url, {
      method: "PATCH",
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

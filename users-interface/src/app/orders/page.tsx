"use client";

import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, Input, Button } from "antd";
import CreateProductModal from "@/components/products/createProduct";
import { Order } from "@/services/interfaces/orders-interface";
import { fetchAllOrders } from "@/services/apis/orders-apis";
import { useStore } from "@/store";

export default function Orders() {
  const { userId } = useStore();
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const fetchUpdateData = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["productsData", token],
    });
  };

  const fetchToken = async () => {
    const token = await getTokenFromCookie();
    if (token && typeof token === "string") {
      setToken(token);
    } else {
      router.push(`/login`);
    }
  };

  const validateSession = () => {
    if (!isTokenValid(token)) {
      router.push(`/login`);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchToken();
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (token) {
      validateSession();
    }
  }, [token]);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["ordersData", token],
    queryFn: async () => {
      const data = await fetchAllOrders(token, userId);
      setOrders(data.data || []);
      return data;
    },
  });

  const dynamicGrid = () => {
    if (ordersData?.data) {
      if (ordersData?.data?.length >= 4) {
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      } else if (ordersData?.data?.length === 3) {
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      } else if (ordersData?.data?.length === 2) {
        return "grid-cols-1 sm:grid-cols-2";
      } else {
        return "grid-cols-1";
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const name = order.orderDate.toString().toLowerCase();
    const query = searchQuery.toLowerCase();
    const orderId = order.id.toLowerCase();
    return name.includes(query) || orderId.includes(query);
  });

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 h-screen">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="flex items-center w-full mb-4">
        <Input
          placeholder="Search by name or ID"
          className="w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="primary" className="ml-2" onClick={showModal}>
          Add new product
        </Button>
      </div>
      <CreateProductModal
        openModal={open}
        closeModal={closeModal}
        token={token}
        fetchCreatedProduct={fetchUpdateData}
      />
      <div className={`grid ${dynamicGrid()} gap-6 w-full max-w-screen-lg`}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-md text-center"
            >
              <h3 className="font-bold text-lg">{order.id}</h3>
              <p className="text-sm text-gray-500">{order.orderDate.toString()}</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                View Details
              </button>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

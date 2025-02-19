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
    const name = new Date(order.orderDate).toLocaleDateString();
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
      <h2 className="text-3xl font-bold mb-6 border-b-2 border-gray-300 pb-2">
        My Orders
      </h2>

      <div className="flex items-center w-full max-w-screen-lg mb-5 space-x-4">
        <Input
          placeholder="Search by ID or Date"
          className="w-full rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button type="primary" className="rounded-md" onClick={showModal}>
          Add Order
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
              className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-lg text-blue-600">
                {order.id}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No orders found</p>
        )}
      </div>
    </div>
  );
}

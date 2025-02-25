"use client";

import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, Input, Button, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import CreateOrderModal from "@/components/orders/createOrder";
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
  const [filterStatus, setFilterStatus] = useState("all"); // Nuevo estado para el filtro
  const queryClient = useQueryClient();

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const fetchCreatedOrder = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["ordersData", token],
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
    const matchesSearch = name.includes(query) || orderId.includes(query);

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "active" && !order.finalized) ||
      (filterStatus === "finalized" && order.finalized);

    return matchesSearch && matchesFilter;
  });

  if (!loading && !isLoading) {
    return (
      <div className="w-full max-w-4xl m-5">
        <h2 className="text-xl font-bold mb-6 border-b-2 border-gray-300 w-full pb-2 text-center">
          My Orders
        </h2>

        <div className="flex items-center w-full max-w-screen-lg mb-5 space-x-4">
          <Input
            placeholder="Search by ID or Date"
            className="w-full rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select
            className="w-40"
            value={filterStatus}
            onChange={setFilterStatus}
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "finalized", label: "Finalized" },
            ]}
          />
          <Button type="primary" className="rounded-md" onClick={showModal}>
            Add Order
          </Button>
        </div>

        <CreateOrderModal
          openModal={open}
          closeModal={closeModal}
          token={token}
          userId={userId}
          fetchCreatedOrder={fetchCreatedOrder}
        />

        {filteredOrders.length > 0 ? (
          <div className={`grid ${dynamicGrid()} gap-6 w-full max-w-screen-lg`}>
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition-shadow max-w-sm flex flex-col justify-between"
              >
                  <h3 className="font-semibold text-lg text-blue-600">
                    {order.id}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">
                    {order.finalized ? "Finalized" : "Active"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <InboxOutlined className="text-6xl text-gray-300 block mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-400">
              No data found
            </h2>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin size="large" />
      </div>
    );
  }
}

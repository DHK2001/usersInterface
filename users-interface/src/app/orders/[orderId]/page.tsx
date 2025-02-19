"use client";

import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, message, Popconfirm, Spin, Table } from "antd";
import { fetchIdProduct } from "@/services/apis/products-apis";
import EditProductModal from "@/components/products/updateProductData";
import {
  deleteOrder,
  fetchIdOrder,
  finalizeOrder,
} from "@/services/apis/orders-apis";

export default function OrderDetails() {
  const [open, setOpen] = useState(false);
  const { orderId } = useParams();
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const fetchUpdateOrderData = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["orderData", token],
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
  });

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["orderData", token],
    queryFn: async () => {
      const data = await fetchIdOrder(token, orderId as string);
      return data;
    },
  });

  const finishOrderAction = async () => {
    setLoading(true);
    try {
      await finalizeOrder(token, orderId as string);
      message.success("Order finished successfully");
      fetchUpdateOrderData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error("An unexpected error occurred");
    }
  };

  const deleteOrderAction = async () => {
    setLoading(true);
    try {
      await deleteOrder(token, orderId as string);
      message.success("Product deleted successfully");
      setLoading(false);
      router.push(`/orders`);
    } catch (error) {
      setLoading(false);
      message.error("An unexpected error occurred");
    }
  };

  const columns = [
    { title: "Product", dataIndex: "name", key: "name" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
  ];

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="m-5">
      <h2 className="text-xl font-bold mb-6 border-b-2 border-gray-300 pb-2 text-center">
        Order
      </h2>
      <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-2xl max-w-md w-full">
        <div className="flex flex-col gap-4 text-lg text-gray-700 w-full">
          <p>
            <span className="font-semibold">Id:</span> {orderData?.data?.id}
          </p>
          <p>
            <span className="font-semibold">Total Amount:</span>{" "}
            {orderData?.data?.totalAmount}
          </p>
          <p>
            <span className="font-semibold">Finalized:</span>{" "}
            {orderData?.data?.finalized ? "Yes" : "No"}
          </p>
          <p>
            <span className="font-semibold">Created Date:</span>{" "}
            {orderData?.data?.orderDate
              ? new Date(orderData.data.orderDate).toLocaleDateString()
              : "N/A"}
          </p>
          <Table
            dataSource={orderData?.data?.products}
            columns={columns}
            rowKey="id"
            pagination={false}
          />
          {!orderData?.data?.finalized ? (
            <>
              <div className="flex gap-4 mt-8 w-full">
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to finish this order?"
                  onConfirm={finishOrderAction}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button color="primary" variant="solid" className="flex-1">
                    Finish
                  </Button>
                </Popconfirm>
                <Button
                  color="primary"
                  variant="solid"
                  className="flex-1"
                  onClick={showModal}
                >
                  Edit
                </Button>
              </div>
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this order?"
                onConfirm={deleteOrderAction}
                okText="Yes"
                cancelText="No"
              >
                <Button color="danger" variant="solid" className="flex-1">
                  Delete
                </Button>
              </Popconfirm>
            </>
          ) : (
            <div className="flex gap-4 mt-8 w-full">
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this order?"
                onConfirm={deleteOrderAction}
                okText="Yes"
                cancelText="No"
              >
                <Button color="danger" variant="solid" className="flex-1">
                  Delete
                </Button>
              </Popconfirm>
              <Button
                color="primary"
                variant="solid"
                className="flex-1"
                onClick={showModal}
              >
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

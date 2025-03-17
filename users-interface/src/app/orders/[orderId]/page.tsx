"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, message, Popconfirm, Spin, Table } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import UpdateOrderModal from "@/components/orders/update-order-modal";
import { fetchIdOrder, finalizeOrder, deleteOrder } from "@/services/orders";
import { useStore } from "@/store";

export default function OrderDetails() {
  const [open, setOpen] = useState(false);
  const { orderId } = useParams();
  const { token } = useStore();
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
    setLoading(true);
    await queryClient.invalidateQueries({
      queryKey: ["orderData", token],
    });
    setLoading(false);
  };

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["orderData", token],
    queryFn: async () => {
      const data = await fetchIdOrder(token, orderId as string);
      setLoading(false);
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

  if (!loading && !isLoading) {
    return (
      <div className="m-5 w-full max-w-4xl flex flex-col items-center">
        <div className="relative flex items-center border-b-2 border-gray-300 pb-2 mb-5 w-full">
          <LeftOutlined
            className="absolute left-0 cursor-pointer"
            onClick={() => {
              router.push(`/orders`);
            }}
          />
          <h2 className="mx-auto text-xl font-bold">Order</h2>
        </div>
        <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-2xl w-auto">
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
                    disabled={orderData?.data?.finalized}
                    color="primary"
                    variant="solid"
                    className="flex-1"
                    onClick={showModal}
                  >
                    Edit
                  </Button>
                  <UpdateOrderModal
                    openModal={open}
                    closeModal={closeModal}
                    orderData={orderData?.data}
                    token={token}
                    orderId={orderId as string}
                  />
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
                  disabled={orderData?.data?.finalized}
                  color="primary"
                  variant="solid"
                  className="flex-1"
                  onClick={showModal}
                >
                  Edit
                </Button>
                <UpdateOrderModal
                  openModal={open}
                  closeModal={closeModal}
                  orderData={orderData?.data}
                  token={token}
                  orderId={orderId as string}
                />
              </div>
            )}
          </div>
        </div>
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

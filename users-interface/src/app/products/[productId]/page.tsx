"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button, message, Popconfirm, Spin, Image } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { deleteProduct, fetchIdProduct } from "@/services/products";
import EditProductModal from "@/components/products/update-product-data";
import { useStore } from "@/store";

export default function ProductDetails() {
  const [open, setOpen] = useState(false);
  const { productId } = useParams();
  const { token } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const { data: productData, isLoading } = useQuery({
    queryKey: ["productData", token],
    queryFn: async () => {
      const data = await fetchIdProduct(token, productId as string);
      setLoading(false);
      return data;
    },
  });

  const deleteProductAction = async () => {
    setLoading(true);
    try {
      await deleteProduct(token, productId as string);
      message.success("Product deleted successfully");
      setLoading(false);
      router.push(`/products`);
    } catch (error) {
      setLoading(false);
      message.error("An unexpected error occurred");
    }
  };

  if (!loading && !isLoading) {
    return (
      <div className="m-5 w-full max-w-4xl flex flex-col items-center">
        <div className="relative flex items-center border-b-2 border-gray-300 pb-2 mb-5 w-full">
          <LeftOutlined
            className="absolute left-0 cursor-pointer"
            onClick={() => {
              router.push(`/products`);
            }}
          />
          <h2 className="mx-auto text-xl font-bold break-words max-w-md break-words">
            {productData?.data?.name}
          </h2>
        </div>
        <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-2xl w-auto">
          <div className="flex flex-col gap-4 text-lg text-gray-700 w-full">
            <p>
              <span className="font-semibold">ID:</span> {productData?.data?.id}
            </p>
            <div className="flex justify-center">
              <Image width={250} src={productData?.data?.imageUrl ?? ""} />
            </div>
            <p className="max-w-md break-words">
              <span className="font-semibold">Description:</span>{" "}
              {productData?.data?.description}
            </p>
            <p>
              <span className="font-semibold">Price:</span>{" "}
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "USD",
              }).format(productData?.data?.price ?? 0)}
            </p>
            <p>
              <span className="font-semibold">Stock:</span>{" "}
              {productData?.data?.stock}
            </p>
            <div className="flex gap-4 mt-8 w-full">
              <Popconfirm
                title="Delete the task"
                description="Are you sure to delete this task?"
                onConfirm={deleteProductAction}
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
              <EditProductModal
                openModal={open}
                closeModal={closeModal}
                productData={productData?.data}
                token={token}
              />
            </div>
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

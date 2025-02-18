"use client";

import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, message, Popconfirm, Spin } from "antd";
import { deleteProduct, fetchIdProduct } from "@/services/apis/products-apis";
import EditProductModal from "@/components/products/updateProductData";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { productId } = useParams();
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

  const fetchUpdateProductData = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["productData", token],
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

  const { data: productData, isLoading } = useQuery({
    queryKey: ["productData", token],
    queryFn: async () => {
      const data = await fetchIdProduct(token, productId as string);
      return data;
    },
  });

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin size="large" />
      </div>
    );
  }

  const deleteProfile = async () => {
    setLoading(true);
    try {
      await deleteProduct(token, productId as string);
      message.success("Product deleted successfully");
      router.push(`/products`);
    } catch (error) {
      message.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-2xl max-w-md w-full">
      <h2 className="text-4xl font-bold text-gray-800 mb-6">{productData?.data?.name}</h2>
      <div className="flex flex-col gap-4 text-lg text-gray-700 w-full">
        <p>
          <span className="font-semibold">ID:</span> {productData?.data?.id}
        </p>
        <p>
          <span className="font-semibold">Description:</span>{" "}
          {productData?.data?.description}
        </p>
        <p>
          <span className="font-semibold">Price:</span> {productData?.data?.price}$
        </p>
        <p>
          <span className="font-semibold">Stock:</span>{" "}
          {productData?.data?.stock}
        </p>
        <div className="flex gap-4 mt-8 w-full">
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={deleteProfile}
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
          fetchUpdateProductData={fetchUpdateProductData}
        />
      </div>
      </div>
    </div>
  );
}

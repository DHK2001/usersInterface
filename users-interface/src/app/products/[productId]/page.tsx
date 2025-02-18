"use client";

import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { fetchIdProduct } from "@/services/apis/products-apis";

export default function Home() {
  const { productId } = useParams();
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

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
          {new Date(productData?.data?.stock ?? "").toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

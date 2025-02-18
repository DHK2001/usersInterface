"use client";

import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, Input, Button } from "antd";
import { Product } from "@/services/interfaces/products-interfaces";
import { fetchAllProducts } from "@/services/apis/products-apis";
import CreateProductModal from "@/components/products/createProduct";

export default function Products() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
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

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["productsData", token],
    queryFn: async () => {
      const data = await fetchAllProducts(token);
      setProducts(data.data || []);
      return data;
    },
  });

  const dynamicGrid = () => {
    if (productsData?.data) {
      if (productsData?.data?.length >= 4) {
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      } else if (productsData?.data?.length === 3) {
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      } else if (productsData?.data?.length === 2) {
        return "grid-cols-1 sm:grid-cols-2";
      } else {
        return "grid-cols-1";
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const name = product.name.toLowerCase();
    const query = searchQuery.toLowerCase();
    const productId = product.id.toLowerCase();
    return name.includes(query) || productId.includes(query);
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 shadow-md text-center"
            >
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.description}</p>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => router.push(`/products/${product.id}`)}>
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

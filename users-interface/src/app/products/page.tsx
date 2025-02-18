"use client";

import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, Input } from "antd";
import { Product } from "@/services/interfaces/products-interfaces";
import { fetchAllProducts } from "@/services/apis/products-apis";

export default function Products() {
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <Input
        placeholder="Search by name or ID"
        className="mb-4 w-full max-w-screen-md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className={`grid ${dynamicGrid()} gap-6 w-full max-w-screen-lg`}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-lg p-4 shadow-md">
              <h3 className="font-bold text-lg">
                {product.name}
              </h3>
              <button
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
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

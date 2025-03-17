"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spin, Input, Button } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { Product } from "@/models/products";
import { fetchAllProducts } from "@/services/products";
import CreateProductModal from "@/components/products/create-product";
import { useStore } from "@/store";

export default function Products() {
  const [open, setOpen] = useState(false);
  const { token } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["productsData", token],
    queryFn: async () => {
      const data = await fetchAllProducts(token);
      setProducts(data.data || []);
      setLoading(false);
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

  if (!loading && !isLoading) {
    return (
      <div className="w-full max-w-4xl m-5">
        <h2 className="text-xl font-bold mb-6 border-b-2 border-gray-300 w-full pb-2 text-center">
          Products
        </h2>
        <div className="flex items-center w-full max-w-screen-lg mb-5 space-x-4">
          <Input
            placeholder="Search by name or ID"
            className="w-full rounded-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="primary" className="rounded-md" onClick={showModal}>
            Add Product
          </Button>
        </div>
        <CreateProductModal
          openModal={open}
          closeModal={closeModal}
          token={token}
        />
        {filteredProducts.length > 0 ? (
          <div className={`grid ${dynamicGrid()} gap-6 w-full max-w-screen-lg`}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition-shadow max-w-sm flex flex-col justify-between"
              >
                <h3 className="font-semibold text-lg text-blue-600 break-words">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mt-2 break-words">
                  {product.description}
                </p>
                <button
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => router.push(`/products/${product.id}`)}
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

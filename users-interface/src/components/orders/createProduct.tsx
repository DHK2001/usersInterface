"use client";

import { createOrder } from "@/services/apis/orders-apis";
import { fetchAllProducts } from "@/services/apis/products-apis";
import { CreateOrderDto } from "@/services/interfaces/orders-interface";
import { Product } from "@/services/interfaces/products-interfaces";
import { useQuery } from "@tanstack/react-query";
import { Form, InputNumber, Select, Table, Button, message, Modal, Spin } from "antd";
import { useEffect, useState } from "react";

interface Props {
  token: string;
  userId: string;
  openModal: boolean;
  closeModal: () => void;
  fetchCreatedOrder: () => void;
}

function CreateOrderModal({
  token,
  userId,
  openModal,
  closeModal,
  fetchCreatedOrder,
}: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { id: string; name: string; amount: number; stock: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    content: string;
  }>({ type: null, content: "" });

  useEffect(() => {
    if (status.type) {
      if (status.type === "success") {
        message.success(status.content);
      } else {
        message.error(status.content);
      }
      setStatus({ type: null, content: "" });
    }
  }, [status]);

  const { isLoading } = useQuery({
    queryKey: ["productsData", token],
    queryFn: async () => {
      const data = await fetchAllProducts(token);
      setProducts(data.data || []);
      return data;
    },
  });

  const addProduct = (id: string, amount: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    const existingProduct = selectedProducts.find((p) => p.id === id);
    if (existingProduct) {
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, amount: Math.min(p.amount + amount, p.stock) } // Limita al stock disponible
            : p
        )
      );
    } else {
      setSelectedProducts((prev) => [
        ...prev,
        { id: product.id, name: product.name, amount, stock: product.stock },
      ]);
    }
  };

  const updateProductAmount = (id: string, newAmount: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, amount: Math.min(newAmount, p.stock) } : p // Limita al stock disponible
      )
    );
  };

  const removeProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      const orderPayload: CreateOrderDto = {
        userId: userId,
        products: selectedProducts.map((p) => ({ id: p.id, amount: p.amount })),
      };

      if (orderPayload.products.length === 0) {
        setStatus({ type: "error", content: "Select at least one product" });
        setLoading(false);
        return;
      }

      const response = await createOrder(token, orderPayload);

      if (response.status === 201) {
        setStatus({ type: "success", content: "Order created successfully" });
        fetchCreatedOrder();
        setSelectedProducts([]);
        closeModal();
      } else {
        setStatus({ type: "error", content: "Order creation failed" });
      }
    } catch (error) {
      setStatus({ type: "error", content: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Product", dataIndex: "name", key: "name" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_: any, record: { id: string; amount: number; stock: number }) => (
        <InputNumber
          min={1}
          max={record.stock} // Máximo permitido según el stock
          value={record.amount}
          onChange={(value) => updateProductAmount(record.id, value || 1)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: { id: string }) => (
        <Button danger onClick={() => removeProduct(record.id)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title="Create Order"
      open={openModal}
      okText="Create"
      onOk={onFinish}
      onCancel={closeModal}
      confirmLoading={loading}
    >
      <Spin tip="Loading" size="large" spinning={loading || isLoading}>
        <Form layout="vertical">
          <Form.Item label="Select Product">
            <Select
              showSearch
              placeholder="Select a product"
              options={products.map((product) => ({
                value: product.id,
                label: `${product.name} (Stock: ${product.stock})`,
              }))}
              onChange={(value) => addProduct(value, 1)}
            />
          </Form.Item>

          <Form.Item label="Selected Products">
            <Table
              dataSource={selectedProducts}
              columns={columns}
              rowKey="id"
              pagination={false}
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default CreateOrderModal;
"use client";

import { createProduct } from "@/services/apis/products-apis";
import { CreateProductDto } from "@/services/interfaces/products-interfaces";
import { Form, Input, message, Modal, Spin } from "antd";
import { useEffect, useState } from "react";

type UpdateFormValues = {
  name: string;
  description: string;
  price: number;
  stock: number;
};

interface Props {
  token: string;
  openModal: boolean;
  closeModal: () => void;
  fetchCreatedProduct: () => void;
}

function CreateProductModal({
  token,
  openModal,
  closeModal,
  fetchCreatedProduct,
}: Props) {
  const [form] = Form.useForm();
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

  const onFinish = async (values: UpdateFormValues) => {
    setLoading(true);
    try {
      const registerPayload: CreateProductDto = {
        name: values.name,
        description: values.description,
        price: Number(values.price),
        stock: Number(values.stock),
      }

      const registerR = await createProduct(
        token,
        registerPayload
      );

      if (registerR.status === 201) {
        setStatus({ type: "success", content: "Product created successfully" });
        fetchCreatedProduct();
        form.resetFields();
        closeModal();
      } else if (registerR.status === 400) {
        setStatus({
          type: "error",
          content: "Account creation failed. Product already exists",
        });
      } else {
        setStatus({
          type: "error",
          content: "Account creation failed. An unexpected error occurred",
        });
      }
    } catch (error) {
      setStatus({ type: "error", content: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    setStatus({ type: "error", content: errorInfo.errorFields[0].errors[0] });
  };

  return (
    <Modal
      title="Create Product"
      open={openModal}
      okText="Create"
      onOk={form.submit}
      onCancel={() => closeModal()}
    >
      <Spin tip="Loading" size="large" spinning={loading}>
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input the product name!" },
              { min: 3, message: "The product name must be at least 3 characters long!" },
            ]}
          >
            <Input placeholder="Enter your the product name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input the product description!",
              },
            ]}
          >
            <Input placeholder="Enter the product description" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please input the product price!" },
            ]}
          >
            <Input type="number" placeholder="Enter the product price" />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[
              { required: true, message: "Please input the product stock!" },
            ]}
          >
            <Input type="number" placeholder="Enter the product stock" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default CreateProductModal;

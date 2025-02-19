"use client";

import { updateProduct } from "@/services/apis/products-apis";
import { Product, UpdateProductDto } from "@/services/interfaces/products-interfaces";
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
  productData: Product | null | undefined;
  openModal: boolean;
  closeModal: () => void;
  fetchUpdateProductData: () => void;
}

function EditProductModal({ token, productData, openModal, closeModal, fetchUpdateProductData }: Props) {
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

  useEffect(() => {
    if (productData && form) {
      form.setFieldsValue({
        name: productData.name || "",
        description: productData.description || "",
        price: productData.price || 0,
        stock: productData.stock || 0,
      });
    }
  }, [form]);

  const onFinish = async (values: UpdateFormValues) => {
    setLoading(true);
    try {
      const registerPayload: UpdateProductDto = {
        name: values.name ?? productData?.name ?? "",
        description: values.description ?? productData?.description ?? "",
        price: Number(values.price) ?? productData?.price,
        stock: Number(values.stock) ?? productData?.stock,
      };

      if (
        registerPayload.name === productData?.name &&
        registerPayload.description === productData?.description &&
        registerPayload.price === productData?.price &&
        registerPayload.stock === productData?.stock
      ) {
        setStatus({ type: "error", content: "No changes detected" });
        return;
      }

      const registerR = await updateProduct(
        token,
        productData?.id ?? "",
        registerPayload
      );

      if (registerR.status === 200) {
        setStatus({ type: "success", content: "Data updated successfully" });
        fetchUpdateProductData();
        closeModal();
      } else if (registerR.status === 400) {
        setStatus({
          type: "error",
          content: "Account Edition failed.",
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
      forceRender
      getContainer={false} 
      title="Edit Product"
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
              { required: true, message: "Please input your the product name!" },
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
              { min: 1, message: "The product name must be at least 3 characters long!" },
            ]}
          >
            <Input placeholder="Enter the product description" />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: "Please input the product price!",
              },
            ]}
          >
            <Input type="number" placeholder="Enter the product price" />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[
              {
                required: true,
                message: "Please input the product stock!",
              },
            ]}
          >
            <Input type="number" placeholder="Enter the product stock" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default EditProductModal;

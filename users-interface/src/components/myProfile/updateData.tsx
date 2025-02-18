"use client";

import { updateUser } from "@/services/apis/users-api";
import { UpdateUserDto, User } from "@/services/interfaces/users-interfaces";
import { Form, Input, message, Modal, Spin } from "antd";
import { useEffect, useState } from "react";

type UpdateFormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

interface Props {
  token: string;
  userData: User | null | undefined;
  openModal: boolean;
  closeModal: () => void;
  fetchUpdateData: () => void;
}

function EditModal({ token, userData, openModal, closeModal, fetchUpdateData }: Props) {
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
    if (userData) {
      form.setFieldsValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      });
    }
  }, [form]);

  const onFinish = async (values: UpdateFormValues) => {
    setLoading(true);
    try {
      const registerPayload: UpdateUserDto = {
        firstName: values.firstName ?? userData?.firstName ?? "",
        lastName: values.lastName ?? userData?.lastName ?? "",
        email: values.email ?? userData?.email ?? "",
      };

      if (
        registerPayload.email === userData?.email &&
        registerPayload.firstName === userData?.firstName &&
        registerPayload.lastName === userData?.lastName
      ) {
        setStatus({ type: "error", content: "No changes detected" });
        return;
      }

      const registerR = await updateUser(
        token,
        userData?.id ?? "",
        registerPayload
      );

      if (registerR.status === 200) {
        setStatus({ type: "success", content: "Data updated successfully" });
        fetchUpdateData();
        closeModal();
      } else if (registerR.status === 400) {
        setStatus({
          type: "error",
          content: "Account creation failed. Email already exists",
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
      title="Edit User Data"
      open={openModal}
      okText="Update"
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
          <Form.Item label="First Name" name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>

          <Form.Item label="Last Name" name="lastName" 
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>

          <Form.Item label="Email" name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}>
            <Input placeholder="Enter your email" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

export default EditModal;

"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { CreateUserDto } from "@/services/interfaces/users-interfaces";
import { createUser } from "@/services/apis/users-api";

type LoginFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      if (values.password !== values.confirmPassword) {
        setStatus({ type: "error", content: "Passwords do not match" });
        return;
      }

      const registerPayload: CreateUserDto = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      };

      const registerR = await createUser(registerPayload);

      if (registerR.status === 201) {
        setStatus({ type: "success", content: "Account created successfully" });
        router.push(`/login`);
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
    <div className="bg-white shadow-md rounded-lg p-8">
      <h1 className="text-4xl font-bold mb-5 text-center">Register</h1>
      <Spin tip="Loading" size="large" spinning={loading}>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ width: "100%", maxWidth: 400 }}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="Enter your first name" />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input placeholder="Enter your last name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your password!" },
            ]}
          >
            <Input.Password placeholder="Confirm your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default Login;

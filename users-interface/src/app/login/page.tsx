"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { loginUser } from "@/services/apis/users-api";
import { useRouter } from "next/navigation";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    content: string;
  }>({ type: null, content: "" });

  useEffect(() => {
    if (status.type) {
      messageApi.open({
        type: status.type,
        content: status.content,
        duration: 5,
      });
      setStatus({ type: null, content: "" });
    }
  }, [status, messageApi]);

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    const loginR = await loginUser(values);
    
    if (loginR.status === 200) {
      setStatus({ type: "success", content: "Login Successful" });
      setTimeout(() => {
        setLoading(false);
        router.push(`/`);
      }, 1000)
    } else if (loginR.status === 401) {
      setLoading(false);
      setStatus({ type: "error", content: "Login Failed. Incorrect password" });
    } else {
      setLoading(false);
      setStatus({ type: "error", content: "Login Failed. User not found" });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    setStatus({ type: "error", content: errorInfo.errorFields[0].errors[0] });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
      {contextHolder}
      <h1 className="text-4xl font-bold mb-5 text-center">Login</h1>
      <Spin tip="Loading" size="large" spinning={loading}>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          style={{ width: "100%", maxWidth: 400 }}
        >
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

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default Login;

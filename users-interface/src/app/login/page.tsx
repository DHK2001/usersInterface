"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, Input, message } from "antd";
import { loginUser } from "@/services/apis/users-api";
import { useRouter } from "next/navigation";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
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
    const loginR = await loginUser(values);

    if (loginR.status === 200) {
      setStatus({ type: "success", content: "Login Successful" });
      router.push(`/`);
    } else if (loginR.status === 401) {
      setStatus({ type: "error", content: "Login Failed. Incorrect password" });
    } else {
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
    </div>
  );
};

export default Login;
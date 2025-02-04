"use client";

import React from "react";
import { Button, Form, Input } from "antd";
import { loginUser } from "@/services/apis/users-api";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {

  const onFinish = async (values: LoginFormValues) => {
    const loginR = await loginUser(values);
    
    if (loginR.status === 200) {
      console.log("Login Successful:", loginR);
    } else if (loginR.status === 401) {
        console.log("Login Failed. Password Incorrect:", loginR);
    } else {
        console.log("Login Failed. User not found:", loginR);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error("Login Failed:", errorInfo);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-8">
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

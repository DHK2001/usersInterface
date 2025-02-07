"use client";

import React, { useState, useEffect } from "react";
import { Button, Form, Input, message, Spin } from "antd";
import { loginUser } from "@/services/apis/users-api";
import { useRouter } from "next/navigation";
import {
  getTokenFromCookie,
  getUserIdFromToken,
  isTokenValid,
  storeTokenInCookie,
} from "@/utils/helpers";
import { useStore } from "@/store";

type LoginFormValues = {
  email: string;
  password: string;
};

const Login: React.FC = () => {
  const [token, setToken] = useState("");
  const { setUserId } = useStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    content: string;
  }>({ type: null, content: "" });

  const fetchToken = async () => {
    const token = await getTokenFromCookie();
    if (token && typeof token === "string") {
      setToken(token);
    }
  };

  const validateSession = () => {
    if (isTokenValid(token)) {
      router.push(`/profile`);
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
  });

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
      const loginR = await loginUser(values);
      if (loginR.status === 200) {
        setStatus({ type: "success", content: "Login Successful" });
        storeTokenInCookie(loginR.data?.accessToken ?? "");
        const userId = getUserIdFromToken(loginR.data?.accessToken ?? "");
        setUserId(userId ?? "");
        router.push(`/profile`);
      } else if (loginR.status === 401) {
        setStatus({
          type: "error",
          content: "Login Failed. Incorrect password",
        });
      } else {
        setStatus({ type: "error", content: "Login Failed. User not found" });
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
            <p
              className="text-center pt-2 cursor-pointer hover:text-blue-500 hover:font-bold"
              onClick={() => router.push("/register")}
            >
              or, sign up
            </p>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default Login;

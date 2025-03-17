"use client";

import { useStore } from "@/store";
import { getTokenFromCookie, publicRoutes, validateSession } from "@/utils/helpers";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { usePathname } from 'next/navigation'

export default function ClientComponent() {
  const [loading, setLoading] = useState(true);
  const { token, setToken } = useStore();
  const router = useRouter();
  const pathname = usePathname()

  const getToken = async () => {
    const token = await getTokenFromCookie();
    if (token && typeof token === "string" && !publicRoutes.includes(pathname)) {
      setToken(token);
    } else {
      router.push(`/login`);
    }
  };

  useEffect(() => {
    getToken();
  }, [token]);

  useEffect(() => {
    if (!publicRoutes.includes(pathname)) {
        setLoading(true);
    if (token) {
      if (!validateSession(token)) {
        router.push(`/login`);
      }
    }
    setLoading(false);
    } else {
        setLoading(false);
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen absolute inset-0 z-10 bg-black bg-opacity-50">
        <Spin size="large" />
      </div>
    );
  }

  return null;
}

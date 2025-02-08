"use client";

import { fetchIdUser } from "@/services/apis/users-api";
import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin } from "antd";

export default function Home() {
  const { userId } = useParams();
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const fetchToken = async () => {
    const token = await getTokenFromCookie();
    if (token && typeof token === "string") {
      setToken(token);
    } else {
      router.push(`/login`);
    }
  };

  const validateSession = () => {
    if (!isTokenValid(token)) {
      router.push(`/login`);
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

  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData", token],
    queryFn: async () => {
      const data = await fetchIdUser(token, userId as string);
      return data;
    },
  });

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-2xl max-w-md w-full">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">User Details</h1>
      <div className="flex flex-col gap-4 text-lg text-gray-700 w-full">
        <p>
          <span className="font-semibold">ID:</span> {userData?.data?.id}
        </p>
        <p>
          <span className="font-semibold">First Name:</span>{" "}
          {userData?.data?.firstName}
        </p>
        <p>
          <span className="font-semibold">Last Name:</span>{" "}
          {userData?.data?.lastName}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {userData?.data?.email}
        </p>
        <p>
          <span className="font-semibold">Creation Date:</span>{" "}
          {new Date(userData?.data?.creationDate ?? "").toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

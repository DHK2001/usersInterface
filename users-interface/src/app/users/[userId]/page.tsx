"use client";

import { fetchIdUser } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Spin } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useStore } from "@/store";

export default function Home() {
  const { userId } = useParams();
  const { token } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData", token],
    queryFn: async () => {
      const data = await fetchIdUser(token, userId as string);
      setLoading(false);
      return data;
    },
  });

  if (!loading && !isLoading) {
    return (
      <div className="m-5 w-full max-w-4xl flex flex-col items-center">
        <div className="relative flex items-center border-b-2 border-gray-300 pb-2 mb-5 w-full">
          <LeftOutlined
            className="absolute left-0 cursor-pointer"
            onClick={() => {
              router.push(`/`);
            }}
          />
          <h2 className="mx-auto text-xl font-bold">User Profile</h2>
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-2xl w-auto">
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
                <span className="font-semibold">Email:</span>{" "}
                {userData?.data?.email}
              </p>
              <p>
                <span className="font-semibold">Creation Date:</span>{" "}
                {new Date(
                  userData?.data?.creationDate ?? ""
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin size="large" />
      </div>
    );
  }
}

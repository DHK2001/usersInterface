"use client";

import { useStore } from "@/store";
import { Button, message, Popconfirm, Spin } from "antd";
import {
  getTokenFromCookie,
  isTokenValid,
  storeTokenInCookie,
} from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, fetchIdUser } from "@/services/apis/users-api";
import EditModal from "@/components/myProfile/updateData";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { userId } = useStore();
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

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

  const fetchUpdateData = async () => {
    await queryClient.invalidateQueries({
      queryKey: ["userData", token],
    });
  };

  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData", token],
    queryFn: async () => {
      const data = await fetchIdUser(token, userId);
      return data;
    },
  });

  const deleteProfile = async () => {
    setLoading(true);
    try {
      await deleteUser(token, userId);
      storeTokenInCookie("");
      setLoading(false);
      message.success("Profile deleted successfully");
      router.push(`/login`);
    } catch (error) {
      setLoading(false);
      message.error("An unexpected error occurred");
    }
  };

  const logOut = () => {
    storeTokenInCookie("");
    router.push(`/login`);
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="m-5">
      <h2 className="text-xl font-bold mb-6 border-b-2 border-gray-300 pb-2 text-center">
        My Profile
      </h2>
      <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-2xl max-w-md w-full">
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
            {new Date(userData?.data?.creationDate ?? "").toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-4 mt-8 w-full">
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={deleteProfile}
            okText="Yes"
            cancelText="No"
          >
            <Button color="danger" variant="solid" className="flex-1">
              Delete
            </Button>
          </Popconfirm>
          <Button
            color="primary"
            variant="solid"
            className="flex-1"
            onClick={showModal}
          >
            Edit
          </Button>
          <EditModal
            openModal={open}
            closeModal={closeModal}
            userData={userData?.data}
            token={token}
            fetchUpdateData={fetchUpdateData}
          />
        </div>
        <div className="flex mt-2 w-full">
          <Button
            color="danger"
            variant="solid"
            className="flex-1"
            onClick={logOut}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

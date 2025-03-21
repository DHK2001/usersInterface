"use client";

import { useStore } from "@/store";
import { Button, message, Popconfirm, Spin } from "antd";
import { storeTokenInCookie } from "@/utils/helpers";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteUser, fetchIdUser } from "@/services/users";
import EditModal from "@/components/my-profile/update-data";
import {
  DeleteOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

export default function Home() {
  const [open, setOpen] = useState(false);
  const { userId } = useStore();
  const { token } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const showModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const { data: userData, isLoading } = useQuery({
    queryKey: ["userData", token],
    queryFn: async () => {
      const data = await fetchIdUser(token, userId);
      setLoading(false);
      return data;
    },
  });

  const deleteProfile = async () => {
    setLoading(true);
    try {
      const data = await deleteUser(token, userId);

      if (data.status === 200) {
        storeTokenInCookie("");
        setLoading(false);
        message.success("Profile deleted successfully");
        router.push(`/login`);
      } else {
        setLoading(false);
        message.error("Cant delete profile with orders actives");
      }
    } catch (error) {
      setLoading(false);
      message.error("An unexpected error occurred");
    }
  };

  const logOut = () => {
    storeTokenInCookie("");
    router.push(`/login`);
  };

  if (!loading && !isLoading) {
    return (
      <div className="m-5 w-full max-w-4xl flex flex-col items-center">
        <div className="relative flex items-center border-b-2 border-gray-300 pb-2 mb-5 w-full">
          <h2 className="mx-auto text-xl font-bold">My Profile</h2>
        </div>
        <div className="flex flex-col items-center p-8 bg-white shadow-lg rounded-2xl w-auto">
          <div className="flex flex-col gap-4 text-lg text-gray-700 w-full">
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
          <div className="flex gap-4 mt-8 w-full">
            <Popconfirm
              title="Delete the task"
              description="Are you sure to delete this task?"
              onConfirm={deleteProfile}
              okText="Yes"
              cancelText="No"
            >
              <Button color="danger" variant="solid" className="flex-1">
                <DeleteOutlined />
              </Button>
            </Popconfirm>
            <Button
              color="primary"
              variant="solid"
              className="flex-1"
              onClick={showModal}
            >
              <EditOutlined />
            </Button>
            <EditModal
              openModal={open}
              closeModal={closeModal}
              userData={userData?.data}
              token={token}
            />
          </div>
          <div className="flex mt-2 w-full">
            <Button
              color="danger"
              variant="solid"
              className="flex-1"
              onClick={logOut}
            >
              <LogoutOutlined />
            </Button>
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

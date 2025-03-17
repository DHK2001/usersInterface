"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { LogoutOutlined, MenuOutlined } from "@ant-design/icons";
import { storeTokenInCookie } from "@/utils/helpers";
import { Button, Drawer, Space } from "antd";

const TopNavbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isDrawerVisible, setDrawerVisible] = useState(false);

  const hideNavbarRoutes = ["/login", "/register"];

  const logOut = () => {
    storeTokenInCookie("");
    router.push(`/login`);
  };

  const toggleDrawer = () => {
    setDrawerVisible(!isDrawerVisible);
  };

  return (
    !hideNavbarRoutes.includes(pathname) && (
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="md:hidden">
          <Button
            icon={<MenuOutlined />}
            onClick={toggleDrawer}
            className="text-black"
          />
        </div>

        <div className="hidden md:flex flex-grow justify-center space-x-8">
          <button
            className="hover:text-gray-300"
            onClick={() => router.push("/")}
          >
            Users
          </button>
          <button
            className="hover:text-gray-300"
            onClick={() => router.push("/products")}
          >
            Products
          </button>
          <button
            className="hover:text-gray-300"
            onClick={() => router.push("/orders")}
          >
            My Orders
          </button>
          <button
            className="hover:text-gray-300"
            onClick={() => router.push("/profile")}
          >
            My Profile
          </button>
        </div>

        <Button
          type="default"
          icon={<LogoutOutlined />}
          className="ml-auto w-auto text-red-500 border border-red-500"
          onClick={logOut}
        >
          Log Out
        </Button>

        <Drawer
          title="Menu"
          placement="right"
          onClose={toggleDrawer}
          open={isDrawerVisible}
        >
          <Space direction="vertical" className="w-full">
            <button
              className="hover:text-gray-300"
              onClick={() => {router.push("/"); setDrawerVisible(false);}}
            >
              Users
            </button>
            <button
              className="hover:text-gray-300"
              onClick={() => {router.push("/products"); setDrawerVisible(false);}}
            >
              Products
            </button>
            <button
              className="hover:text-gray-300"
              onClick={() => {router.push("/orders"); setDrawerVisible(false);}}
            >
              My Orders
            </button>
            <button
              className="hover:text-gray-300"
              onClick={() => {router.push("/profile"); setDrawerVisible(false);}}
            >
              My Profile
            </button>
          </Space>
        </Drawer>
      </nav>
    )
  );
};

export default TopNavbar;

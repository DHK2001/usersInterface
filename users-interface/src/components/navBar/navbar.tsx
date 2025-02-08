"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { usePathname } from "next/navigation";

const TopNavbar: React.FC = () => {
  const router = useRouter();

  const pathname = usePathname();

  const hideNavbarRoutes = ["/login", "/register"];

  return (
    !hideNavbarRoutes.includes(pathname) && (
      <nav className="flex justify-center items-center p-4 bg-gray-800 text-white">
        <div className="flex space-x-8">
          <button
            className="hover:text-gray-300"
            onClick={() => router.push("/")}
          >
            Home
          </button>
          <button
            className="hover:text-gray-300"
            onClick={() => router.push("/profile")}
          >
            My Profile
          </button>
        </div>
      </nav>
    )
  );
};

export default TopNavbar;

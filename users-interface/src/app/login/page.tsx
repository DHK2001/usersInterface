"use client";

import { fetchAllUsers } from "@/services/apis/users-api";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";

const login = () => {

  return (
    <>
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Login</h1>
            <form className="flex flex-col space-y-4">
            <input
                type="text"
                placeholder="Username"
                className="p-2 border
                border-gray-300 rounded"
            />
            <input
                type="password"
                placeholder="Password"
                className="p-2 border
                border-gray-300 rounded"
            />
            <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
            >
                Login
            </button>
            </form>
        </div>
    </>
  );
};

export default login;
"use client";

import { fetchAllUsers } from "@/services/apis/users-api";
import { useStore } from "@/store";
import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin, Input } from "antd";
import { User } from "@/services/interfaces/users-interfaces";

export default function Home() {
  const { userId } = useStore();
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
  }, [token]);

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["userData", token],
    queryFn: async () => {
      const data = await fetchAllUsers(token);
      setUsers(data.data || []);
      return data;
    },
  });

  const dynamicGrid = () => {
    if (usersData?.data) {
      if (usersData?.data?.length >= 4) {
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      } else if (usersData?.data?.length === 3) {
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      } else if (usersData?.data?.length === 2) {
        return "grid-cols-1 sm:grid-cols-2";
      } else {
        return "grid-cols-1";
      }
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    const userId = user.id.toLowerCase();
    return fullName.includes(query) || userId.includes(query);
  });

  if (!loading && !isLoading) {
    return (
      <div className="w-full max-w-4xl m-5">
        <h2 className="text-xl font-bold mb-6 border-b-2 border-gray-300 w-full pb-2 text-center">
          All Users
        </h2>
        <Input
          placeholder="Search by name or ID"
          className="w-full rounded-md mb-5"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className={`grid ${dynamicGrid()} gap-6 w-full max-w-screen-lg`}>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(
              (user) =>
                user.id !== userId && (
                  <div
                    key={user.id}
                    className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition-shadow max-w-sm"
                  >
                    <h3 className="font-semibold text-lg text-blue-600">
                      {user.firstName} {user.lastName}
                    </h3>
                    <button
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      onClick={() => router.push(`/users/${user.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                )
            )
          ) : (
            <p className="text-gray-500">No users found</p>
          )}
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

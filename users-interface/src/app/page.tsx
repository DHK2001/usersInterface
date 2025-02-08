"use client";

import { fetchAllUsers } from "@/services/apis/users-api";
import { useStore } from "@/store";
import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spin } from "antd";
import { User } from "@/services/interfaces/users-interfaces";

export default function Home() {
  const { userId } = useStore();
  const [token, setToken] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

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
      if (usersData?.data?.length - 1 >= 4) {
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      } else if (usersData?.data?.length - 1 === 3) {
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      } else if (usersData?.data?.length - 1 === 2) {
        return "grid-cols-1 sm:grid-cols-2";
      } else {
        return "grid-cols-1";
      }
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 h-screen">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <div className={`grid ${dynamicGrid()} gap-6 w-full max-w-screen-lg`}>
        {users ? (
          users.map(
            (user) =>
              user.id !== userId && (
                <div key={user.id} className="border rounded-lg p-4 shadow-md">
                  <h3 className="font-bold text-lg">
                    {user.firstName} {user.lastName}
                  </h3>
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => router.push(`/users/${user.id}`)}
                  >
                    View Details
                  </button>
                </div>
              )
          )
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
}

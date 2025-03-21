"use client";

import { fetchAllUsers } from "@/services/users";
import { useStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spin, Input } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { User } from "@/models/users";

export default function Home() {
  const { userId } = useStore();
  const router = useRouter();
  const { token } = useStore();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["userData", token],
    queryFn: async () => {
      const data = await fetchAllUsers(token);
      setUsers(data.data || []);
      setLoading(false);
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
        {filteredUsers.length - 1 > 0 ? (
          <div className={`grid ${dynamicGrid()} gap-6 w-full max-w-screen-lg`}>
            {filteredUsers.map(
              (user) =>
                user.id !== userId && (
                  <div
                    key={user.id}
                    className="border rounded-lg p-6 shadow-md bg-white hover:shadow-lg transition-shadow max-w-sm flex flex-col justify-between"
                  >
                    <h3 className="font-semibold text-lg text-blue-600 text-center">
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
            )}
          </div>
        ) : (
          <div className="text-center">
            <InboxOutlined className="text-6xl text-gray-300 block mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-400">
              No data found
            </h2>
          </div>
        )}
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

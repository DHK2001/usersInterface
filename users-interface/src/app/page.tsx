"use client";

import { useStore } from "@/store";
import { message } from "antd";
import { getTokenFromCookie, isTokenValid } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { userId } = useStore();
  const [token, setToken] = useState("");
  const [clientUserId, setClientUserId] = useState("");
  const router = useRouter();

  const fetchToken = async () => {
    const token = await getTokenFromCookie();
    if (token && typeof token === 'string') {
      setToken(token);
    }
  };

  useEffect(() => {
    setClientUserId(userId);
  }, [userId]);

  useEffect(() => {
    fetchToken();
  }, [token]);

  useEffect(() => {
    if (!isTokenValid(token)) {
      message.error("Invalid token");
      router.push(`/login`);
    }
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {clientUserId || "No user ID found"}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
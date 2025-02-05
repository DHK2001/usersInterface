"use client";

import { getTokenFromCookie, getUserIdFromToken } from "@/utils/helpers";
import { useEffect, useState } from "react";

export default function Home() {

  const [userId, setUserId] = useState<string>("");
  
  useEffect(() => {
    const fetchToken = async () => {
      const token = await getTokenFromCookie();
      if (typeof token === 'string') {
        setUserId(getUserIdFromToken(token) ?? "");
      } else {
        console.log("Failed to retrieve token");
      }
    };
    fetchToken();
  }, []);



  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {userId ?? "No user ID found"}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}

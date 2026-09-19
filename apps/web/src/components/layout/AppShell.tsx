"use client";

import React from "react";
import { useChat } from "@/contexts/ChatContext";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { isChatOpen } = useChat();

  return (
    <div
      className={`min-h-screen flex flex-col transition-[margin-right] duration-300 ease-in-out ${
        isChatOpen ? "xl:mr-[600px] 2xl:mr-[680px]" : ""
      }`}
    >
      {children}
    </div>
  );
}

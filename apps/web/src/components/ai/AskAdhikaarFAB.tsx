"use client";

import React from "react";
import { useChat } from "@/contexts/ChatContext";

export default function AskAdhikaarFAB() {
  const { isChatOpen, toggleChat } = useChat();

  if (isChatOpen) return null;

  return (
    <aside className="fixed bottom-6 right-6 z-40">
      <button
        onClick={toggleChat}
        type="button"
        className="flex items-center gap-space-sm px-space-lg py-space-md bg-surface-container-lowest text-primary rounded-full shadow-[0_8px_24px_-4px_rgba(16,42,67,0.18)] hover:shadow-[0_12px_28px_-4px_rgba(16,42,67,0.25)] transition-all hover:-translate-y-0.5 p-[2px] bg-gradient-to-r from-[#FF9933] via-surface-container-lowest to-[#138808] cursor-pointer group"
      >
        <div className="flex items-center gap-space-xs bg-surface-container-lowest px-space-md py-space-xs rounded-full group-hover:bg-surface-container-low transition-colors">
          <span className="text-[#FF9933] text-headline-sm font-bold">✦</span>
          <span className="font-title-md text-title-md text-primary font-bold">Ask Adhikaar</span>
          <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
        </div>
      </button>
    </aside>
  );
}

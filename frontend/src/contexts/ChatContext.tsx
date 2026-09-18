"use client";

import React, { createContext, useContext, useState } from "react";

interface ChatContextType {
  isChatOpen: boolean;
  openChat: (initialQuery?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  activeQuery: string;
}

const ChatContext = createContext<ChatContextType>({
  isChatOpen: false,
  openChat: () => {},
  closeChat: () => {},
  toggleChat: () => {},
  activeQuery: "",
});

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeQuery, setActiveQuery] = useState(
    "Unpaid salary for 2 months by workshop in Gurugram, facing termination threats..."
  );

  const openChat = (initialQuery?: string) => {
    if (initialQuery) {
      setActiveQuery(initialQuery);
    }
    setIsChatOpen(true);
  };

  const closeChat = () => setIsChatOpen(false);
  const toggleChat = () => setIsChatOpen((prev) => !prev);

  return (
    <ChatContext.Provider
      value={{ isChatOpen, openChat, closeChat, toggleChat, activeQuery }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}

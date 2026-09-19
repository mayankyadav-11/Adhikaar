"use client";

import React, { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/services/apiClient";
import { HealthResponse } from "@adhikaar/shared";

interface ApiStatusIndicatorProps {
  variant?: "pill" | "compact";
  className?: string;
}

export default function ApiStatusIndicator({
  variant = "compact",
  className = "",
}: ApiStatusIndicatorProps) {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkHealth = useCallback(async (showChecking = false) => {
    if (showChecking) {
      setStatus("checking");
    }
    try {
      const data = await apiClient.getHealth();
      setHealth(data);
      setStatus("connected");
      setLastChecked(new Date());
    } catch {
      setHealth(null);
      setStatus("disconnected");
      setLastChecked(new Date());
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    apiClient
      .getHealth()
      .then((data) => {
        if (!isCancelled) {
          setHealth(data);
          setStatus("connected");
          setLastChecked(new Date());
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setHealth(null);
          setStatus("disconnected");
          setLastChecked(new Date());
        }
      });

    // Poll every 30 seconds for live updates
    const interval = setInterval(() => {
      checkHealth(false);
    }, 30000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [checkHealth]);

  if (variant === "pill") {
    return (
      <div
        className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          status === "connected"
            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
            : status === "disconnected"
              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
              : "bg-surface-container-high text-on-surface-variant border border-outline-variant/20"
        } ${className}`}
        title={
          health
            ? `API Service: ${health.service} v${health.version} | DB: ${health.database.status}`
            : "Attempting connection to backend API"
        }
      >
        <span className="relative flex h-2 w-2">
          {status === "connected" && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              status === "connected"
                ? "bg-emerald-500"
                : status === "disconnected"
                  ? "bg-amber-500"
                  : "bg-outline-variant animate-pulse"
            }`}
          />
        </span>
        <span>
          {status === "connected"
            ? "API Connected"
            : status === "disconnected"
              ? "API Offline"
              : "Checking API..."}
        </span>
        {status === "disconnected" && (
          <button
            onClick={() => checkHealth(true)}
            className="ml-1 underline text-[11px] hover:opacity-80 transition-opacity"
            title="Retry connecting to API"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  // Compact variant (ideal for footer status line or navbar meta)
  return (
    <div
      className={`inline-flex items-center gap-2 font-label-sm text-label-sm ${className}`}
      title={
        health
          ? `Backend API: ${health.service} (${health.status}) • DB: ${health.database.status} • Uptime: ${health.uptimeSeconds}s`
          : lastChecked
            ? "Backend API unreachable on port 5000"
            : "Checking API health..."
      }
    >
      <span className="relative flex h-2 w-2">
        {status === "connected" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            status === "connected"
              ? "bg-emerald-500"
              : status === "disconnected"
                ? "bg-amber-500"
                : "bg-outline-variant animate-pulse"
          }`}
        />
      </span>
      <span
        className={
          status === "connected"
            ? "text-emerald-700 dark:text-emerald-400 font-medium"
            : status === "disconnected"
              ? "text-amber-700 dark:text-amber-400 font-medium"
              : "text-on-surface-variant"
        }
      >
        {status === "connected"
          ? "API Connected"
          : status === "disconnected"
            ? "API Offline"
            : "Connecting to API..."}
      </span>
      {status === "disconnected" && (
        <button
          onClick={() => checkHealth(true)}
          className="text-primary hover:underline text-[11px] font-medium"
        >
          (Retry)
        </button>
      )}
    </div>
  );
}

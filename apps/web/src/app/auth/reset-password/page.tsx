"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader } from "@/components/ui/Loader";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password || !confirmPassword) {
      setErrorMessage("Please enter both password fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container py-16 flex items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden">
        <div className="bg-primary px-6 py-5 text-on-primary flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container-lowest/15 flex items-center justify-center text-tertiary-fixed">
            <span className="material-symbols-outlined text-[22px]">lock_reset</span>
          </div>
          <div>
            <h1 className="font-title-lg text-title-lg font-bold text-white">Reset Password</h1>
            <p className="font-label-sm text-[11px] text-white/80">Choose a new secure password</p>
          </div>
        </div>

        <div className="p-6 sm:p-7 flex flex-col gap-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-error-container text-on-error-container border border-error/20 flex items-start gap-2.5 text-body-sm">
              <span className="material-symbols-outlined text-[18px] text-error shrink-0 mt-0.5">
                error
              </span>
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              <h3 className="font-title-md text-title-md font-bold text-on-surface">
                Password Updated Successfully
              </h3>
              <p className="font-body-sm text-on-surface-variant">
                Your password has been changed. Redirecting to home...
              </p>
              <div className="mt-2">
                <Loader size="sm" label="Redirecting..." />
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-2 w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-opacity-90 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <Loader size="xs" label="Updating..." />
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

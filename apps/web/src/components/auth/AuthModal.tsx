"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Loader } from "@/components/ui/Loader";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, openAuthModal } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(authModalMode);
  
  // Sync state if modal mode changes externally
  React.useEffect(() => {
    setMode(authModalMode);
  }, [authModalMode]);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const supabase = createClient();

  const resetMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const switchMode = (newMode: "signin" | "signup" | "forgot") => {
    resetMessages();
    setMode(newMode);
  };

  // 1. Email + Password Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.session) {
        closeAuthModal();
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Email + Password Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please provide all required fields.");
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name || email.split("@")[0],
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
      } else if (data.user && !data.session) {
        // Confirmation required
        setSuccessMessage("Account created! Please check your email to confirm your registration.");
      } else {
        // Automatically signed in
        closeAuthModal();
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage("Password reset instructions have been dispatched to your email.");
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Google OAuth
  const handleGoogleSignIn = async () => {
    resetMessages();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to initialize Google Sign In.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-6 py-5 text-on-primary flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center text-tertiary-fixed">
              <span className="material-symbols-outlined text-[20px]">
                {mode === "signin" ? "login" : mode === "signup" ? "person_add" : "lock_reset"}
              </span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md font-bold text-white">
                {mode === "signin"
                  ? "Sign In to Adhikaar"
                  : mode === "signup"
                  ? "Create Citizen Account"
                  : "Reset Your Password"}
              </h2>
              <p className="font-label-sm text-[11px] text-white/80">
                Civic rights, welfare schemes, and legal guidance
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 flex flex-col gap-4.5">
          {/* Alerts */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-error-container text-on-error-container border border-error/20 flex items-start gap-2.5 text-body-sm">
              <span className="material-symbols-outlined text-[18px] text-error shrink-0 mt-0.5">
                error
              </span>
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-secondary-container text-on-secondary-container border border-secondary/20 flex items-start gap-2.5 text-body-sm">
              <span className="material-symbols-outlined text-[18px] text-secondary shrink-0 mt-0.5">
                check_circle
              </span>
              <span className="flex-1">{successMessage}</span>
            </div>
          )}

          {/* Social Auth (Google) - only for signin and signup */}
          {mode !== "forgot" && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-outline-variant/40 bg-surface-container-low hover:bg-surface-container transition-all text-on-surface font-label-md text-label-md font-semibold cursor-pointer shadow-xs disabled:opacity-60"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-outline-variant/30" />
                <span className="font-label-sm text-[11px] text-on-surface-variant font-medium uppercase tracking-wider">
                  Or continue with email
                </span>
                <div className="flex-1 h-px bg-outline-variant/30" />
              </div>
            </>
          )}

          {/* Form */}
          <form
            onSubmit={
              mode === "signin"
                ? handleSignIn
                : mode === "signup"
                ? handleSignUp
                : handleForgotPassword
            }
            className="flex flex-col gap-3.5"
          >
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface text-body-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-outline"
              />
            </div>

            {mode !== "forgot" && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => switchMode("forgot")}
                      className="font-label-sm text-[12px] text-primary hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
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
            )}

            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                  Confirm Password
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
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full py-2.5 px-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md font-bold hover:bg-opacity-90 transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <Loader size="xs" label="Processing..." />
              ) : mode === "signin" ? (
                "Sign In"
              ) : mode === "signup" ? (
                "Create Account"
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </form>

          {/* Footer switches */}
          <div className="pt-2 text-center text-body-sm text-on-surface-variant border-t border-outline-variant/20">
            {mode === "signin" && (
              <p>
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="text-primary font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign Up
                </button>
              </p>
            )}

            {mode === "signup" && (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="text-primary font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign In
                </button>
              </p>
            )}

            {mode === "forgot" && (
              <p>
                Remembered your password?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="text-primary font-bold hover:underline cursor-pointer ml-1"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState, FormEvent } from "react";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

type Profile = {
  full_name: string;
  phone: string;
};

type Mode = "login" | "signup" | "forgot" | "reset";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone: "",
  });

  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("mode") === "reset") {
      setMode("reset");
    }

    const getInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
  console.error("Profile loading error:", error.message);
  return;
}

if (data) {
  setProfile({
    full_name: data.full_name || "",
    phone: data.phone || "",
  });
  setFullName(data.full_name || "");
  setPhone(data.phone || "");
}
    };

    fetchProfile();
  }, [user]);

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Login successful.");
    }

    setSubmitting(false);
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resetMessages();
    setSubmitting(true);

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
        },
        emailRedirectTo: `${window.location.origin}/account`,
      },
    });

    if (error) {
      setError(error.message);
    } else if (data.session) {
      setMessage("Your account has been created successfully.");
    } else {
      setMessage(
        "Account created! Please check your email and verify your account before logging in."
      );
      setMode("login");
      setPassword("");
    }

    setSubmitting(false);
  };

  const handleForgotPassword = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    resetMessages();
    setSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/account?mode=reset`,
      }
    );

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password reset link has been sent to your email.");
    }

    setSubmitting(false);
  };

  const handleResetPassword = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    resetMessages();
    setSubmitting(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Your password has been updated successfully.");
      setMode("login");
      setPassword("");
      window.history.replaceState({}, "", "/account");
    }

    setSubmitting(false);
  };

  const handleProfileUpdate = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!user) return;

    resetMessages();
    setSubmitting(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setError(error.message);
    } else {
      setProfile({
        full_name: fullName.trim(),
        phone: phone.trim(),
      });
      setMessage("Profile updated successfully.");
    }

    setSubmitting(false);
  };

  const handleLogout = async () => {
    resetMessages();
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    } else {
      setMode("login");
      setPassword("");
      setEmail("");
      setMessage("You have been logged out.");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] text-[#303a32]">
        Loading your account...
      </main>
    );
  }

  if (user && mode !== "reset") {
    return (
      <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
        <header className="border-b border-[#dedbd5] bg-[#f4f5f0] px-5 py-5">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link
              href="/"
              className="font-serif text-2xl tracking-[0.2em]"
            >
              VELORA
            </Link>

            <Link
              href="/"
              className="text-sm transition hover:text-[#8d8277]"
            >
              Continue Shopping
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <p className="text-xs tracking-[0.3em] text-[#8a8178]">
            CUSTOMER ACCOUNT
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
            My Account
          </h1>

          <p className="mt-3 text-sm text-[#716b64]">
            Welcome back, {profile.full_name || user.email}
          </p>

          {message && (
            <p className="mt-5 border border-[#c9d5c6] bg-[#edf2e9] p-3 text-sm text-[#405a3c]">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-5 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
            <div className="border border-[#dedbd5] bg-white p-6 sm:p-8">
              <h2 className="font-serif text-2xl">Account Details</h2>

              <p className="mt-5 break-all text-sm text-[#716b64]">
                {user.email}
              </p>

              <div className="mt-8 border-t border-[#e5e0d9] pt-6">
                <button
                  onClick={handleLogout}
                  className="w-full border border-[#303a32] px-5 py-3 text-xs tracking-[0.15em] transition hover:bg-[#303a32] hover:text-white"
                >
                  LOG OUT
                </button>
              </div>
            </div>

            <div className="border border-[#dedbd5] bg-white p-6 sm:p-8">
              <h2 className="font-serif text-2xl">Personal Information</h2>

              <form
                onSubmit={handleProfileUpdate}
                className="mt-6 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-xs tracking-wider text-[#716b64]">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-[#dedbd5] bg-[#fdfcf9] px-4 py-3 text-sm outline-none focus:border-[#8d8277]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs tracking-wider text-[#716b64]">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full border border-[#dedbd5] bg-[#f0eee9] px-4 py-3 text-sm text-[#777] outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs tracking-wider text-[#716b64]">
                    MOBILE NUMBER
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full border border-[#dedbd5] bg-[#fdfcf9] px-4 py-3 text-sm outline-none focus:border-[#8d8277]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#303a32] px-5 py-3 text-xs tracking-[0.15em] text-white transition hover:bg-[#485448] disabled:opacity-50"
                >
                  {submitting ? "SAVING..." : "SAVE CHANGES"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-[#24211e]">
      <header className="border-b border-[#dedbd5] bg-[#f4f5f0] px-5 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.2em]"
          >
            VELORA
          </Link>

          <Link
            href="/"
            className="text-sm transition hover:text-[#8d8277]"
          >
            Back to Store
          </Link>
        </div>
      </header>

      <section className="flex min-h-[75vh] items-center justify-center px-5 py-12">
        <div className="w-full max-w-md border border-[#dedbd5] bg-white p-7 shadow-sm sm:p-10">
          <p className="text-center text-[10px] tracking-[0.3em] text-[#8a8178]">
            THE ART OF TEXTILES
          </p>

          <h1 className="mt-4 text-center font-serif text-4xl">
            {mode === "signup"
              ? "Create Account"
              : mode === "forgot"
              ? "Forgot Password"
              : mode === "reset"
              ? "Reset Password"
              : "Welcome Back"}
          </h1>

          <p className="mt-3 text-center text-sm text-[#716b64]">
            {mode === "signup"
              ? "Create your Velora customer account."
              : mode === "forgot"
              ? "Enter your email to receive a password reset link."
              : mode === "reset"
              ? "Choose a new password for your account."
              : "Sign in to access your Velora account."}
          </p>

          {message && (
            <p className="mt-6 border border-[#c9d5c6] bg-[#edf2e9] p-3 text-sm text-[#405a3c]">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-6 border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <form
            onSubmit={
              mode === "signup"
                ? handleSignup
                : mode === "forgot"
                ? handleForgotPassword
                : mode === "reset"
                ? handleResetPassword
                : handleLogin
            }
            className="mt-8 space-y-5"
          >
            {mode === "signup" && (
              <>
                <div>
                  <label className="mb-2 block text-xs tracking-wider text-[#716b64]">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none focus:border-[#8d8277]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs tracking-wider text-[#716b64]">
                    MOBILE NUMBER
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your mobile number"
                    className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none focus:border-[#8d8277]"
                  />
                </div>
              </>
            )}

            {mode !== "reset" && (
              <div>
                <label className="mb-2 block text-xs tracking-wider text-[#716b64]">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-[#dedbd5] px-4 py-3 text-sm outline-none focus:border-[#8d8277]"
                />
              </div>
            )}

            {mode !== "forgot" && (
              <div>
                <label className="mb-2 block text-xs tracking-wider text-[#716b64]">
                  {mode === "reset" ? "NEW PASSWORD" : "PASSWORD"}
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full border border-[#dedbd5] px-4 py-3 pr-16 text-sm outline-none focus:border-[#8d8277]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#716b64] hover:text-black"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>
            )}

            {mode === "login" && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setMode("forgot");
                  }}
                  className="text-xs text-[#716b64] underline underline-offset-4 hover:text-black"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#303a32] px-5 py-4 text-xs tracking-[0.2em] text-white transition duration-300 hover:bg-[#485448] disabled:opacity-50"
            >
              {submitting
                ? "PLEASE WAIT..."
                : mode === "signup"
                ? "CREATE ACCOUNT"
                : mode === "forgot"
                ? "SEND RESET LINK"
                : mode === "reset"
                ? "UPDATE PASSWORD"
                : "SIGN IN"}
            </button>
          </form>

          <div className="mt-7 border-t border-[#e5e0d9] pt-6 text-center">
            {mode === "login" ? (
              <p className="text-sm text-[#716b64]">
                New to Velora?{" "}
                <button
                  onClick={() => {
                    resetMessages();
                    setMode("signup");
                  }}
                  className="font-medium text-[#303a32] underline underline-offset-4"
                >
                  Create Account
                </button>
              </p>
            ) : (
              <button
                onClick={() => {
                  resetMessages();
                  setMode("login");
                }}
                className="text-sm text-[#303a32] underline underline-offset-4"
              >
                Back to Sign In
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

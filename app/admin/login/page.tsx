
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Email ya password sahi nahi hai. Dobara check karein.");
      return;
    }

    router.push("/admin/orders");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f2] px-5 text-[#24211e]">
      <div className="w-full max-w-md border border-[#ddd8d0] bg-white p-8 sm:p-10">
        <div className="text-center">
          <h1 className="font-serif text-4xl tracking-[0.2em]">
            VELORA
          </h1>
          <p className="mt-2 text-[10px] tracking-[0.35em] text-[#8a8178]">
            ADMINISTRATION
          </p>
          <div className="mx-auto my-8 h-px w-12 bg-[#b8aea2]" />
          <h2 className="font-serif text-2xl">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#716b64]">
            Sign in to manage your orders.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-xs tracking-wider">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#ddd8d0] bg-[#f8f6f2] px-4 py-3 text-sm outline-none focus:border-[#24211e]"
              placeholder="Admin email"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs tracking-wider">
              PASSWORD
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#ddd8d0] bg-[#f8f6f2] px-4 py-3 text-sm outline-none focus:border-[#24211e]"
              placeholder="Your password"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#24211e] px-5 py-4 text-xs tracking-[0.25em] text-white transition-colors hover:bg-[#51483f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>
      </div>
    </main>
  );
}

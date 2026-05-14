"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/discover");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ec80ad] via-[#d4a0d8] to-[#BA94D1] p-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-[family-name:var(--font-pacifico)] text-white drop-shadow-md">TinDog</h1>
          <p className="text-white/80 mt-2 text-base font-medium tracking-wide">Find your dog&apos;s perfect match 🐾</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec80ad]/40 focus:border-[#ec80ad] transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ec80ad]/40 focus:border-[#ec80ad] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ec80ad] to-[#BA94D1] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 mt-2 tracking-wide"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>

          <p className="text-center text-gray-400 text-sm pt-1">
            New here?{" "}
            <Link href="/register" className="text-[#ec80ad] font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

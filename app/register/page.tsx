"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      router.push("/setup");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BA94D1] via-[#d4a0d8] to-[#ec80ad] p-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-[family-name:var(--font-pacifico)] text-white drop-shadow-md">TinDog</h1>
          <p className="text-white/80 mt-2 text-base font-medium tracking-wide">Join thousands of happy pups 🐾</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-4">
          {error && (
            <div className="text-red-500 text-sm bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA94D1]/40 focus:border-[#BA94D1] transition-all"
            />
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA94D1]/40 focus:border-[#BA94D1] transition-all"
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA94D1]/40 focus:border-[#BA94D1] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#BA94D1] to-[#ec80ad] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.98] transition-all duration-150 disabled:opacity-60 mt-2 tracking-wide"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-center text-gray-400 text-sm pt-1">
            Already have an account?{" "}
            <Link href="/login" className="text-[#BA94D1] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

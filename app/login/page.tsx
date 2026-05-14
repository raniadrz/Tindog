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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ec80ad] to-[#BA94D1] p-4">
      <div className="w-full max-w-md">
        <h1 className="text-5xl font-[family-name:var(--font-pacifico)] text-white text-center mb-2">🐾 TinDog</h1>
        <p className="text-white/90 text-center mb-8">Meet dogs nearby</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>

          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#ec80ad] bg-gray-50"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#ec80ad] bg-gray-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ec80ad] hover:bg-[#d96f9c] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log In"}
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            New here?{" "}
            <Link href="/register" className="text-[#ec80ad] font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

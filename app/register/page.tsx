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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BA94D1] to-[#ec80ad] p-4">
      <div className="w-full max-w-md">
        <h1 className="text-5xl font-[family-name:var(--font-pacifico)] text-white text-center mb-2">🐾 TinDog</h1>
        <p className="text-white/90 text-center mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Join TinDog</h2>

          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <input
            type="text"
            placeholder="Your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#BA94D1] bg-gray-50"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#BA94D1] bg-gray-50"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#BA94D1] bg-gray-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#BA94D1] hover:bg-[#a57dc0] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#BA94D1] font-bold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

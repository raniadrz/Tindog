"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DogProfile } from "@/lib/neon";

const PLAN_INFO = {
  chihuahua: { label: "Chihuahua", sub: "Free plan", emoji: "🐕", bg: "bg-gray-100", color: "text-gray-600" },
  labrador: { label: "Labrador", sub: "$49 / month", emoji: "🦮", bg: "bg-purple-50", color: "text-[#BA94D1]" },
  mastiff: { label: "Mastiff", sub: "$99 / month", emoji: "🐕‍🦺", bg: "bg-violet-50", color: "text-[#930ae9]" },
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DogProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((p) => setProfile(p))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSignOut() {
    if (!confirm("Sign out?")) return;
    setSigningOut(true);
    await signOut(auth);
    router.push("/login");
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin text-5xl">🐾</div>
    </div>
  );
  if (!profile) return null;

  const plan = PLAN_INFO[profile.plan as keyof typeof PLAN_INFO] ?? PLAN_INFO.chihuahua;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <div className="relative h-48 bg-gradient-to-br from-[#ec80ad] to-[#BA94D1]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden">
            <Image src={profile.photo_url} alt={profile.dog_name} fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="pt-16 pb-4 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{profile.dog_name}</h2>
        <p className="text-[#BA94D1] font-semibold mt-0.5">{profile.breed} · {profile.age} yrs</p>
        <p className="text-gray-400 text-sm mt-1">📍 {profile.location}</p>
      </div>

      <div className="px-4 space-y-3 max-w-lg mx-auto pb-6">
        {profile.bio && (
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">About</p>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Current Plan</p>
          <div className={`flex items-center gap-3 p-3 rounded-2xl ${plan.bg} mb-4`}>
            <span className="text-3xl">{plan.emoji}</span>
            <div>
              <p className={`font-bold ${plan.color}`}>{plan.label}</p>
              <p className="text-xs text-gray-400">{plan.sub}</p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#BA94D1] to-[#ec80ad] text-white font-bold px-5 py-3 rounded-2xl text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
          >
            ⭐ Upgrade Plan
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Owner</p>
          <p className="text-gray-800 font-semibold">{profile.owner_name}</p>
          <p className="text-gray-400 text-sm">{profile.email}</p>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full border-2 border-red-200 text-red-400 font-bold py-4 rounded-3xl hover:bg-red-50 active:scale-[0.98] transition-all duration-150 disabled:opacity-60"
        >
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </div>
  );
}

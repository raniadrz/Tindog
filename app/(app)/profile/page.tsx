"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { DogProfile } from "@/lib/neon";

const PLAN_INFO = {
  chihuahua: { label: "Chihuahua (Free)", emoji: "🐕", color: "text-gray-500" },
  labrador: { label: "Labrador – $49/mo", emoji: "🦮", color: "text-[#BA94D1]" },
  mastiff: { label: "Mastiff – $99/mo", emoji: "🐕‍🦺", color: "text-[#930ae9]" },
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DogProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then((r) => r.json()).then((p) => { setProfile(p); setLoading(false); });
  }, []);

  async function handleSignOut() {
    if (!confirm("Sign out?")) return;
    setSigningOut(true);
    await signOut(auth);
    router.push("/login");
  }

  if (loading) return <div className="flex justify-center items-center min-h-screen"><div className="animate-spin text-4xl">🐾</div></div>;
  if (!profile) return null;

  const plan = PLAN_INFO[profile.plan as keyof typeof PLAN_INFO] ?? PLAN_INFO.chihuahua;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f3b9d1] to-[#BA94D1]">
      {/* Hero */}
      <div className="flex flex-col items-center pt-14 pb-6 px-6 text-center">
        <div className="relative w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden mb-4">
          <Image src={profile.photo_url} alt={profile.dog_name} fill className="object-cover" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{profile.dog_name}</h2>
        <p className="text-[#BA94D1] font-semibold">{profile.breed} · {profile.age} yrs old</p>
        <p className="text-gray-500 text-sm mt-1">📍 {profile.location}</p>
      </div>

      <div className="px-4 space-y-3 max-w-lg mx-auto">
        {profile.bio && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">About</p>
            <p className="text-gray-700">{profile.bio}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Current Plan</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{plan.emoji}</span>
            <span className={`font-bold text-lg ${plan.color}`}>{plan.label}</span>
          </div>
          <Link href="/pricing" className="inline-flex items-center gap-2 bg-[#BA94D1] text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#a57dc0] transition-colors">
            ⭐ Upgrade Plan
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Owner</p>
          <p className="text-gray-700">{profile.owner_name}</p>
          <p className="text-gray-400 text-sm">{profile.email}</p>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="w-full border-2 border-red-300 text-red-500 font-bold py-3.5 rounded-2xl hover:bg-red-50 transition-colors disabled:opacity-60"
        >
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </div>
  );
}

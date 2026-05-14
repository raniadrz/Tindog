"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { DogProfile } from "@/lib/neon";

type Match = { id: string; otherDog: DogProfile };

export default function MatchesPage() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "matches"), where("users", "array-contains", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const result: Match[] = [];
      snap.forEach((d) => {
        const data = d.data();
        const otherUid = data.users.find((u: string) => u !== user.uid);
        const otherDog = data.profiles?.[otherUid] as DogProfile;
        if (otherDog) result.push({ id: d.id, otherDog });
      });
      setMatches(result);
      setLoading(false);
    });
    return unsub;
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#BA94D1] to-[#f3b9d1]">
      <header className="px-6 pt-14 pb-5">
        <h1 className="text-3xl font-[family-name:var(--font-pacifico)] text-white drop-shadow-sm">Matches</h1>
        <p className="text-white/70 text-sm mt-1">{matches.length > 0 ? `${matches.length} mutual connections` : "Keep swiping!"}</p>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin text-5xl">🐾</div>
        </div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center px-10">
          <span className="text-7xl mb-5">🐾</span>
          <h3 className="text-xl font-bold text-white mb-2">No matches yet!</h3>
          <p className="text-white/70">Keep swiping to find your dog&apos;s soulmate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 px-4">
          {matches.map(({ id, otherDog }) => (
            <Link
              key={id}
              href={`/chat/${id}`}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200 active:scale-[0.97]"
            >
              <div className="relative h-44">
                <Image src={otherDog.photo_url} alt={otherDog.dog_name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="font-bold text-sm leading-tight">{otherDog.dog_name}</p>
                  <p className="text-pink-200 text-xs font-medium">{otherDog.breed}</p>
                </div>
              </div>
              <div className="px-3 py-2.5">
                <p className="text-gray-400 text-xs font-medium">Tap to chat 💬</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

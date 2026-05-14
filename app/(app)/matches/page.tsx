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
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-[family-name:var(--font-pacifico)] text-white">Your Matches ❤️</h1>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20"><div className="animate-spin text-4xl">🐾</div></div>
      ) : matches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-8">
          <span className="text-6xl mb-4">🐾</span>
          <h3 className="text-xl font-bold text-white mb-2">No matches yet!</h3>
          <p className="text-white/80">Keep swiping to find your dog's soulmate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 px-4">
          {matches.map(({ id, otherDog }) => (
            <Link key={id} href={`/chat/${id}`} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className="relative h-36">
                <Image src={otherDog.photo_url} alt={otherDog.dog_name} fill className="object-cover" />
              </div>
              <div className="p-3">
                <p className="font-bold text-gray-800">{otherDog.dog_name}</p>
                <p className="text-[#BA94D1] text-xs font-semibold">{otherDog.breed}</p>
                <p className="text-gray-400 text-xs mt-1">Tap to chat 💬</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

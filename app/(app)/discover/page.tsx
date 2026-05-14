"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { DogProfile } from "@/lib/neon";
import SwipeDeck from "@/components/SwipeDeck";
import MatchModal from "@/components/MatchModal";

export default function DiscoverPage() {
  const { user } = useAuth();
  const [myProfile, setMyProfile] = useState<DogProfile | null>(null);
  const [candidates, setCandidates] = useState<DogProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [match, setMatch] = useState<{ profile: DogProfile; matchId: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    async function load() {
      const [meRes, allRes, swipedSnap] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/dogs"),
        getDocs(collection(db, "users", user!.uid, "swipes")),
      ]);
      const me: DogProfile = await meRes.json();
      const all: DogProfile[] = await allRes.json();
      const swiped = new Set(swipedSnap.docs.map((d) => d.id));
      setMyProfile(me);
      setCandidates(all.filter((p) => !swiped.has(p.uid)));
      setLoading(false);
    }
    load();
  }, [user]);

  const handleLike = useCallback(async (liked: DogProfile) => {
    if (!user || !myProfile) return;
    await setDoc(doc(db, "users", user.uid, "swipes", liked.uid), { liked: true, ts: Date.now() });

    const theirSwipe = await getDoc(doc(db, "users", liked.uid, "swipes", user.uid));
    if (theirSwipe.exists() && theirSwipe.data().liked) {
      const matchId = [user.uid, liked.uid].sort().join("_");
      await setDoc(doc(db, "matches", matchId), {
        users: [user.uid, liked.uid],
        profiles: { [user.uid]: myProfile, [liked.uid]: liked },
        createdAt: serverTimestamp(),
      }, { merge: true });
      setMatch({ profile: liked, matchId });
    }
  }, [user, myProfile]);

  const handleDislike = useCallback(async (disliked: DogProfile) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid, "swipes", disliked.uid), { liked: false, ts: Date.now() });
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ec80ad] to-[#f3b9d1]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4">
        <h1 className="text-2xl font-[family-name:var(--font-pacifico)] text-white">🐾 TinDog</h1>
        <Link href="/pricing" className="bg-white/20 backdrop-blur-sm text-white font-bold px-4 py-2 rounded-full text-sm hover:bg-white/30 transition-colors">
          ⭐ Upgrade
        </Link>
      </header>

      <div className="px-4 pb-4 h-[calc(100vh-100px)]">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin text-4xl">🐾</div>
          </div>
        ) : (
          <SwipeDeck profiles={candidates} onLike={handleLike} onDislike={handleDislike} />
        )}
      </div>

      {match && myProfile && (
        <MatchModal
          myProfile={myProfile}
          matchedProfile={match.profile}
          matchId={match.matchId}
          onClose={() => setMatch(null)}
        />
      )}
    </div>
  );
}

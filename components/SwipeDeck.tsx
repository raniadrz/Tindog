"use client";
import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { DogProfile } from "@/lib/neon";

type Props = {
  profiles: DogProfile[];
  onLike: (p: DogProfile) => void;
  onDislike: (p: DogProfile) => void;
};

function DogCard({ profile, onLike, onDislike, isTop }: {
  profile: DogProfile;
  onLike: () => void;
  onDislike: () => void;
  isTop: boolean;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x > 120) onLike();
    else if (info.offset.x < -120) onDislike();
  }

  if (!isTop) {
    return (
      <div className="absolute w-full h-full rounded-3xl overflow-hidden shadow-lg scale-95 -translate-y-2 pointer-events-none">
        <CardContent profile={profile} />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute w-full h-full rounded-3xl overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
    >
      {/* LIKE badge */}
      <motion.div
        className="absolute top-10 left-6 z-10 border-4 border-green-400 text-green-500 font-black text-2xl px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm -rotate-12"
        style={{ opacity: likeOpacity }}
      >
        WOOF ❤️
      </motion.div>
      {/* NOPE badge */}
      <motion.div
        className="absolute top-10 right-6 z-10 border-4 border-red-400 text-red-500 font-black text-2xl px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm rotate-12"
        style={{ opacity: nopeOpacity }}
      >
        NOPE 💨
      </motion.div>

      <CardContent profile={profile} />
    </motion.div>
  );
}

function CardContent({ profile }: { profile: DogProfile }) {
  return (
    <>
      <div className="relative w-full h-[65%]">
        <Image
          src={profile.photo_url || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600"}
          alt={profile.dog_name}
          fill
          className="object-cover"
          sizes="(max-width: 480px) 100vw, 480px"
        />
      </div>
      <div className="bg-white p-5 h-[35%]">
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-bold text-gray-800">{profile.dog_name}</h2>
          <span className="text-gray-400 text-lg">{profile.age} yrs</span>
        </div>
        <p className="text-[#BA94D1] font-semibold mt-1">{profile.breed}</p>
        <p className="text-gray-400 text-sm mt-1">📍 {profile.location}</p>
        {profile.bio && <p className="text-gray-500 text-sm mt-2 line-clamp-2 italic">{profile.bio}</p>}
      </div>
    </>
  );
}

export default function SwipeDeck({ profiles, onLike, onDislike }: Props) {
  const [deck, setDeck] = useState(profiles);

  const handleLike = useCallback(() => {
    const top = deck[0];
    if (!top) return;
    setDeck((prev) => prev.slice(1));
    onLike(top);
  }, [deck, onLike]);

  const handleDislike = useCallback(() => {
    const top = deck[0];
    if (!top) return;
    setDeck((prev) => prev.slice(1));
    onDislike(top);
  }, [deck, onDislike]);

  if (deck.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center gap-4">
        <span className="text-7xl">🐾</span>
        <h3 className="text-2xl font-bold text-gray-700">No more dogs nearby!</h3>
        <p className="text-gray-400">Check back later for new pals.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center">
      {/* Card stack */}
      <div className="relative w-full max-w-sm h-[520px] mx-auto">
        <AnimatePresence>
          {deck.slice(0, 3).reverse().map((profile, i, arr) => {
            const isTop = i === arr.length - 1;
            return (
              <DogCard
                key={profile.uid}
                profile={profile}
                isTop={isTop}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex gap-6 mt-6">
        <button
          onClick={handleDislike}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform border-2 border-red-100"
          aria-label="Nope"
        >
          ❌
        </button>
        <button
          onClick={handleLike}
          className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform border-2 border-green-100"
          aria-label="Like"
        >
          ❤️
        </button>
      </div>
    </div>
  );
}

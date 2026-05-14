"use client";
import { useState, useCallback, useEffect } from "react";
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
  const rotate = useTransform(x, [-200, 0, 200], [-14, 0, 14]);
  const likeOpacity = useTransform(x, [30, 110], [0, 1]);
  const nopeOpacity = useTransform(x, [-110, -30], [1, 0]);

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (info.offset.x > 120) onLike();
    else if (info.offset.x < -120) onDislike();
  }

  if (!isTop) {
    return (
      <div className="absolute w-full h-full rounded-[2rem] overflow-hidden shadow-lg scale-[0.94] -translate-y-3 pointer-events-none">
        <CardContent profile={profile} />
      </div>
    );
  }

  return (
    <motion.div
      className="absolute w-full h-full rounded-[2rem] overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.01 }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: 0, opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
    >
      <motion.div
        className="absolute top-8 left-5 z-10 bg-green-400/90 backdrop-blur-sm text-white font-black text-lg px-5 py-2 rounded-2xl -rotate-12 shadow-lg"
        style={{ opacity: likeOpacity }}
      >
        WOOF ❤️
      </motion.div>
      <motion.div
        className="absolute top-8 right-5 z-10 bg-red-400/90 backdrop-blur-sm text-white font-black text-lg px-5 py-2 rounded-2xl rotate-12 shadow-lg"
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
    <div className="relative w-full h-full bg-black">
      <Image
        src={profile.photo_url || "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600"}
        alt={profile.dog_name}
        fill
        className="object-cover opacity-95"
        sizes="(max-width: 480px) 100vw, 480px"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="text-3xl font-bold tracking-tight">{profile.dog_name}</h2>
          <span className="text-xl font-light opacity-80">{profile.age}</span>
        </div>
        <p className="text-pink-300 font-semibold text-sm">{profile.breed}</p>
        <p className="text-white/60 text-sm mt-0.5">📍 {profile.location}</p>
        {profile.bio && (
          <p className="text-white/70 text-sm mt-2 line-clamp-2 leading-relaxed">{profile.bio}</p>
        )}
      </div>
    </div>
  );
}

export default function SwipeDeck({ profiles, onLike, onDislike }: Props) {
  const [deck, setDeck] = useState(profiles);

  useEffect(() => { setDeck(profiles); }, [profiles]);

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
      <div className="flex flex-col items-center justify-center h-full text-center gap-3 px-8">
        <span className="text-8xl mb-2">🐾</span>
        <h3 className="text-2xl font-bold text-white">No more dogs nearby!</h3>
        <p className="text-white/70 text-base">Check back later for new pals.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between">
      <div className="relative w-full max-w-sm flex-1 mx-auto" style={{ maxHeight: "calc(100% - 100px)" }}>
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

      <div className="flex items-center gap-6 py-5">
        <button
          onClick={handleDislike}
          className="w-14 h-14 rounded-full bg-white/95 shadow-xl flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all duration-150 border border-red-100"
          aria-label="Nope"
        >
          ✕
        </button>
        <button
          onClick={handleLike}
          className="rounded-full bg-gradient-to-br from-[#ec80ad] to-[#BA94D1] shadow-2xl flex items-center justify-center text-3xl hover:scale-110 active:scale-95 transition-all duration-150"
          style={{ width: 72, height: 72 }}
          aria-label="Like"
        >
          ❤️
        </button>
        <button
          onClick={handleDislike}
          className="w-14 h-14 rounded-full bg-white/95 shadow-xl flex items-center justify-center text-xl hover:scale-110 active:scale-95 transition-all duration-150 border border-gray-100 opacity-0 pointer-events-none"
          aria-label="placeholder"
        />
      </div>
    </div>
  );
}

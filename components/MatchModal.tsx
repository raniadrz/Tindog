"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DogProfile } from "@/lib/neon";

type Props = {
  myProfile: DogProfile;
  matchedProfile: DogProfile;
  matchId: string;
  onClose: () => void;
};

export default function MatchModal({ myProfile, matchedProfile, matchId, onClose }: Props) {
  const router = useRouter();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#ec80ad] to-[#BA94D1] p-6">
      <div className="text-center max-w-sm w-full">
        <h2 className="text-4xl font-[family-name:var(--font-pacifico)] text-white mb-2">It's a Match! 🐾</h2>
        <p className="text-white/90 mb-10">
          {myProfile.dog_name} and {matchedProfile.dog_name} liked each other!
        </p>

        <div className="flex justify-center items-center gap-4 mb-12">
          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden relative">
            <Image src={myProfile.photo_url} alt={myProfile.dog_name} fill className="object-cover" />
          </div>
          <span className="text-4xl">❤️</span>
          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden relative">
            <Image src={matchedProfile.photo_url} alt={matchedProfile.dog_name} fill className="object-cover" />
          </div>
        </div>

        <button
          onClick={() => { onClose(); router.push(`/chat/${matchId}`); }}
          className="w-full bg-white text-[#ec80ad] font-bold text-lg py-4 rounded-2xl mb-4 hover:bg-pink-50 transition-colors"
        >
          Send a Woof 🐕
        </button>
        <button
          onClick={onClose}
          className="text-white/80 underline text-sm hover:text-white transition-colors"
        >
          Keep Swiping
        </button>
      </div>
    </div>
  );
}

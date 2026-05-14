"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { DogProfile } from "@/lib/neon";

type Msg = { id: string; sender: string; text: string };

export default function ChatPage() {
  const { id: matchId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [otherDog, setOtherDog] = useState<DogProfile | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchId || !user) return;
    getDoc(doc(db, "matches", matchId)).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const otherUid = data.users.find((u: string) => u !== user.uid);
        setOtherDog(data.profiles?.[otherUid] ?? null);
      }
    });

    const q = query(collection(db, "matches", matchId, "messages"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Msg)));
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    });
    return unsub;
  }, [matchId, user]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !user || !matchId) return;
    const t = text.trim();
    setText("");
    await addDoc(collection(db, "matches", matchId, "messages"), {
      sender: user.uid,
      text: t,
      createdAt: serverTimestamp(),
    });
  }

  return (
    <div className="flex flex-col h-screen bg-[#f3b9d1]">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-12 pb-3 bg-[#ec80ad] shadow-sm">
        <Link href="/matches" className="text-white text-2xl font-bold mr-1">‹</Link>
        {otherDog && (
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
            <Image src={otherDog.photo_url} alt={otherDog.dog_name} fill className="object-cover" />
          </div>
        )}
        <div>
          <p className="font-bold text-white">{otherDog?.dog_name ?? "Chat"} 🐾</p>
          {otherDog && <p className="text-white/80 text-xs">{otherDog.breed}</p>}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin text-3xl">🐾</div></div>
        ) : messages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">🐾</p>
            <p>Say hello to {otherDog?.dog_name ?? "your match"}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const mine = msg.sender === user?.uid;
            return (
              <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  mine ? "bg-[#ec80ad] text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="flex items-end gap-3 px-4 py-3 bg-white border-t border-gray-100">
        <input
          type="text"
          placeholder="Woof something…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border-2 border-gray-100 rounded-2xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#ec80ad] bg-gray-50 text-sm"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="w-11 h-11 rounded-full bg-[#ec80ad] text-white flex items-center justify-center hover:bg-[#d96f9c] transition-colors disabled:opacity-50"
        >
          ➤
        </button>
      </form>
    </div>
  );
}

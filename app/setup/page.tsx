"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function SetupPage() {
  const { user } = useAuth();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [dogName, setDogName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(f);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dogName || !breed || !age || !location) { setError("Please fill in all required fields."); return; }
    setError("");
    setLoading(true);

    try {
      let photo_url = "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400";

      if (file) {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        if (!res.ok) throw new Error("Image upload failed");
        const data = await res.json();
        photo_url = data.url;
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_name: user?.displayName ?? user?.email?.split("@")[0] ?? "",
          dog_name: dogName,
          breed,
          age: parseInt(age, 10),
          bio,
          photo_url,
          location,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      router.push("/discover");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ec80ad] to-[#BA94D1] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Set Up Your Dog's Profile 🐾</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-4">
          {/* Photo picker */}
          <div className="flex justify-center mb-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-28 h-28 rounded-full border-4 border-[#ec80ad] overflow-hidden bg-pink-50 flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              {preview ? (
                <Image src={preview} alt="Dog" width={112} height={112} className="object-cover w-full h-full" />
              ) : (
                <span className="text-center text-sm text-gray-400">📸<br />Add Photo</span>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dog's Name *</label>
              <input type="text" placeholder="e.g. Biscuit" required value={dogName} onChange={(e) => setDogName(e.target.value)}
                className="w-full mt-1 border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#ec80ad] bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Breed *</label>
              <input type="text" placeholder="e.g. Corgi" required value={breed} onChange={(e) => setBreed(e.target.value)}
                className="w-full mt-1 border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#ec80ad] bg-gray-50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age (years) *</label>
              <input type="number" placeholder="3" required min={0} max={25} value={age} onChange={(e) => setAge(e.target.value)}
                className="w-full mt-1 border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#ec80ad] bg-gray-50" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">City *</label>
              <input type="text" placeholder="e.g. New York" required value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#ec80ad] bg-gray-50" />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
              <textarea placeholder="Tell other dogs about yourself…" value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                className="w-full mt-1 border-2 border-gray-100 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-[#ec80ad] bg-gray-50 resize-none" />
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-[#ec80ad] hover:bg-[#d96f9c] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-60 mt-2">
            {loading ? "Saving…" : "Let's Find Matches! 🐾"}
          </button>
        </form>
      </div>
    </div>
  );
}

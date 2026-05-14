"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    key: "chihuahua",
    name: "Chihuahua",
    price: "Free",
    emoji: "🐕",
    features: ["5 Matches Per Day", "10 Messages Per Day", "Unlimited App Usage"],
    color: "border-gray-300",
    btnClass: "bg-gray-700 hover:bg-gray-800 text-white",
    featured: false,
  },
  {
    key: "labrador",
    name: "Labrador",
    price: "$49 / mo",
    emoji: "🦮",
    features: ["Unlimited Matches", "Unlimited Messages", "Unlimited App Usage", "Priority Support"],
    color: "border-[#BA94D1] ring-2 ring-[#BA94D1]",
    btnClass: "bg-[#BA94D1] hover:bg-[#a57dc0] text-white",
    featured: true,
  },
  {
    key: "mastiff",
    name: "Mastiff",
    price: "$99 / mo",
    emoji: "🐕‍🦺",
    features: ["Priority Listing", "Unlimited Matches", "Unlimited Messages", "Unlimited App Usage", "Verified Badge"],
    color: "border-[#930ae9]",
    btnClass: "bg-[#930ae9] hover:bg-[#7a09c4] text-white",
    featured: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function selectPlan(plan: string) {
    setLoading(plan);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    setLoading(null);
    if (res.ok) router.push("/profile");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BA94D1] to-[#ec80ad] p-4">
      {/* Back */}
      <div className="flex items-center gap-3 pt-12 pb-6 max-w-2xl mx-auto">
        <Link href="/profile" className="text-white text-2xl font-bold">‹</Link>
        <h1 className="text-2xl font-[family-name:var(--font-pacifico)] text-white">A Plan for Every Dog 🐾</h1>
      </div>
      <p className="text-center text-white/90 mb-8">Simple and affordable pricing for you and your pup.</p>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto pb-12">
        {PLANS.map((plan) => (
          <div key={plan.key} className={`relative bg-white rounded-3xl p-6 border-2 shadow-xl flex flex-col ${plan.color}`}>
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#BA94D1] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                Most Popular
              </div>
            )}
            <div className="text-4xl mb-2">{plan.emoji}</div>
            <h2 className="text-xl font-bold text-gray-800">{plan.name}</h2>
            <p className="text-3xl font-black text-gray-900 mt-2 mb-4">{plan.price}</p>
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-green-500 font-bold mt-0.5">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => selectPlan(plan.key)}
              disabled={loading !== null}
              className={`w-full py-3 rounded-xl font-bold transition-colors disabled:opacity-60 ${plan.btnClass}`}
            >
              {loading === plan.key ? "Updating…" : "Select Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

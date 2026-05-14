"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/discover", label: "Discover", icon: "🐾" },
  { href: "/matches", label: "Matches", icon: "❤️" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 shadow-lg z-40">
      <div className="flex justify-around max-w-lg mx-auto">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center py-3 px-6 text-xs font-semibold transition-colors ${
                active ? "text-[#ec80ad]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span className="text-xl mb-0.5">{icon}</span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

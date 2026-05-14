import type { Metadata } from "next";
import { Pacifico } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TinDog – Meet dogs nearby",
  description: "Find the true love of your dog's life. Easy to use, guaranteed to work.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${pacifico.variable} h-full`}>
      <body className="min-h-full">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

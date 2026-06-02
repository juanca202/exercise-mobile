import type { Metadata } from "next";
import { Geist_Mono, Lexend } from "next/font/google";

import { AuthHydrator } from "@/features/auth/components/AuthHydrator";

import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Banca web — Demostración",
  description: "Demostración de banca web con autenticación mock",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${lexend.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AuthHydrator>
          <div className="root flex min-h-full flex-1 flex-col">{children}</div>
        </AuthHydrator>
      </body>
    </html>
  );
}

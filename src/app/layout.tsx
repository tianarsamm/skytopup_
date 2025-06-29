import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sky Game Store",
  description: "Top Up Game Aman, Murah, dan Cepat!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.className}>
      <body className="font-aubette antialiased">
        <div className="relative w-full min-h-screen overflow-x-hidden">
          <video
            className="fixed top-0 left-0 w-full h-full object-cover z-0"
            src="/Video/bg4.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="relative z-10 bg-black/60 min-h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

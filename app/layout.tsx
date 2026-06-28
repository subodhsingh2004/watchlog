import type { Metadata } from "next";
import { Geist_Mono, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"]
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Watchlog",
  description: "Store and manage your watch history and watchlist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistMono.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body style={{ fontFamily: "var(--font-geist-mono)" }} className="h-dvh w-full flex justify-center items-center p-8">

        <div className="flex flex-col w-full sm:w-250 h-full sm:h-160 rounded-2xl bg-[#101010] border border-[#212121]">

          <div className="min-h-11 w-full bg-[#181818] rounded-t-2xl flex items-center px-3">
            <div className="flex gap-1 absolute">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <h1 className="text-[#d9d9d9] ml-auto mr-auto font-semibold">[Watchlog]</h1>
          </div>

          <div className="flex w-full h-full overflow-y-scroll">{children}</div>

        </div>

      </body>
    </html>
  );
}

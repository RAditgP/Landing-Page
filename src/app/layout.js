import "./globals.css";
import Providers from "./providers"; // ⬅ penting! JANGAN pakai {} tidak ada named export
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevLaunch - Buat Website Modern Lebih Cepat dan Efisien",
  description:
    "Dengan DevLaunch, kamu bisa membangun landing page profesional hanya dalam hitungan menit.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

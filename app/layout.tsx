import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import Header from "./components/Header";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-heading",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meetup clone",
  description: "A Meetup clone built with Next.js",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

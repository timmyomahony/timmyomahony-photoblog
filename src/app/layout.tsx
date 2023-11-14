import type { Metadata } from "next";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "./globals.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | Timmy O'Mahony",
    default: "Photos",
  },
  authors: [{ name: "Timmy O'Mahony", url: "https://timmyomahony.com" }],
  creator: "Timmy O'Mahony",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-suisse-intl">
        <Header />
        <main className="container">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

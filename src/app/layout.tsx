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
        <main className="container px-4">{children}</main>
        <Footer />
        {process.env.NODE_ENV == "development" && (
          <div className="fixed bottom-3 left-3 bg-black rounded-full text-sm h-8 w-8 flex items-center justify-center p-1 text-white">
            <div className="sm:hidden">none</div>
            <div className="hidden sm:block md:hidden">sm</div>
            <div className="hidden md:block lg:hidden">md</div>
            <div className="hidden lg:block xl:hidden">lg</div>
            <div className="hidden xl:block 2xl:hidden">xl</div>
            <div className="hidden 2xl:block">2xl</div>
          </div>
        )}
      </body>
    </html>
  );
}

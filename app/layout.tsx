import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import localFont from "next/font/local";
import "./globals.scss";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
});

const ppmori = localFont({
  src: '../fonts/PPMori-Regular.woff',
  display: 'swap',
  variable: '--font-pp-mori',
})

const ppmoriExtraBold = localFont({
  src: '../fonts/PPMori-ExtraBold.woff',
  display: 'swap',
  variable: '--font-pp-mori-extra-bold',
})

const saLongBeach = localFont({
  src: '../fonts/SALongBeach.woff',
  display: 'swap',
  variable: '--font-sa-long-beach',
})

// Optional: Use local Libre-Franklin instead of Google Fonts
// const libreFranklinLocal = localFont({
//   src: '../fonts/Libre-Franklin.woff',
//   display: 'swap',
//   variable: '--font-libre-franklin',
// })

export const metadata: Metadata = {
  title: "NSE Policy Generator",
  description: "Generate NSE policies for your school",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${libreFranklin.variable} ${ppmori.variable} ${ppmoriExtraBold.variable} ${saLongBeach.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import "./globals.css";

import localFont from "next/font/local";

const NNNouvelleGrotesk = localFont({
  src: [
    {
      path: "../assets/fonts/NNNouvelleGrotesk-Fat.woff2",
      weight: "800",
    },
    {
      path: "../assets/fonts/NNNouvelleGrotesk-Normal.woff2",
      weight: "400",
    },
  ],
  display: "swap",
  variable: "--nnnouvellegrotesk",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-roda-blue">
      <body className={NNNouvelleGrotesk.className}>{children}</body>
    </html>
  );
}

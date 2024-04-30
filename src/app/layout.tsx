import "./globals.css";

import localFont from "next/font/local";

export const GreedNarrow = localFont({
  src: [
    {
      path: "../assets/fonts/GreedNarrow-Heavy.woff2",
      weight: "800",
    },
    {
      path: "../assets/fonts/GreedNarrow-Medium.woff2",
      weight: "400",
    },
  ],
  display: "swap",
  variable: "--greednarrow",
});

export const NNNouvelleGrotesk = localFont({
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

export const fontVariables = `${GreedNarrow.variable} ${NNNouvelleGrotesk.variable}`;


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

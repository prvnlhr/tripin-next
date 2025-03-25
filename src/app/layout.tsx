import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/satoshi/Satoshi-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../../public/fonts/satoshi/Satoshi-VariableItalic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-satoshi",
});

const lufga = localFont({
  src: [
    {
      path: "../../public/fonts/lufga/LufgaThin.woff",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaThinItalic.woff",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/lufga/LufgaExtraLight.woff",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaExtraLightItalic.woff",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/lufga/LufgaLight.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaLightItalic.woff",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/lufga/LufgaRegular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaItalic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/lufga/LufgaMedium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaMediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/lufga/LufgaSemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaSemiBoldItalic.woff",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/lufga/LufgaBold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaBoldItalic.woff",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/lufga/LufgaExtraBold.woff",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaExtraBoldItalic.woff",
      weight: "800",
      style: "italic",
    },
    {
      path: "../../public/fonts/lufga/LufgaBlack.woff",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/lufga/LufgaBlackItalic.woff",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-lufga",
});

export const metadata: Metadata = {
  title: "Tripin - Cab Service",
  description:
    "Reliable and convenient cab service to get you where you need to go.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.variable} ${lufga.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

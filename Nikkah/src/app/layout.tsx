import type { Metadata, Viewport } from "next";
import { fontVariables } from "./fonts";
import { SITE } from "@/config/event";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.titleUrdu,
  description: SITE.descriptionUrdu,
  alternates: { canonical: "/" },
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    locale: "ur_PK",
    url: "/",
    siteName: SITE.titleEn,
    title: SITE.titleUrdu,
    description: SITE.descriptionUrdu,
  },
  twitter: { card: "summary_large_image", title: SITE.titleUrdu, description: SITE.descriptionUrdu },
  // Machine translation reflows the Nastaliq into a Latin face and breaks the RTL layout,
  // so the browser must not offer it. `google: notranslate` suppresses Chrome's prompt;
  // the `notranslate` class and translate="no" below cover the rest and manual invocation.
  other: { google: "notranslate" },
};

export const viewport: Viewport = {
  themeColor: "#051a13",
  colorScheme: "dark",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ur"
      dir="rtl"
      translate="no"
      className={`notranslate ${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
        <GrainOverlay />
      </body>
    </html>
  );
}

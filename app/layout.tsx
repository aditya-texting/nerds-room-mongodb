import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { QueryProvider, ThemeProvider, AuthProvider } from "@/src/providers";
import { Toaster } from "react-hot-toast";
import { LayoutWrapper } from "@/src/components/layout/LayoutWrapper";
import { OnboardingModal } from "@/src/modules/auth/components/OnboardingModal";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nerds Room | Building the Future",
  description: "A developer-driven technology community where innovation meets collaboration.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader
            color="#22c55e"
            height={3}
            showSpinner={false}
            shadow="0 0 10px #22c55e, 0 0 5px #22c55e"
            zIndex={9999}
          />
          <QueryProvider>
            <AuthProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
              <OnboardingModal />
              <Toaster position="top-center" containerStyle={{ zIndex: 99999 }} />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


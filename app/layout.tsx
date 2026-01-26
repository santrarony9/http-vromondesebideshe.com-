import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "Vromon Deshe Bideshe | Premium Travel Agency",
    description: "Experience the world with Vromon Deshe Bideshe. Best tours, best prices.",
};

import { headers } from "next/headers";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const headersList = headers();
    const pathname = headersList.get("x-pathname") || "";
    const isAdmin = pathname.startsWith("/admin");

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {!isAdmin && <Navbar />}
                    <main className="min-h-screen">
                        {children}
                    </main>
                    {!isAdmin && <Footer />}
                </ThemeProvider>
            </body>
        </html>
    );
}

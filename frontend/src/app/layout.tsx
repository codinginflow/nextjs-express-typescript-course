import { Metadata } from "next";
import "./globals.scss";
import "./utils.css";
import { Inter } from 'next/font/google';
import AuthModalsProvider from "./AuthModalsProvider";
import { Container } from "@/components/bootstrap";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import OnboardingRedirect from "./OnboardingRedirect";
import { Suspense } from "react";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: "Flow Blog - Share your ideas",
    description: "A full-stack NextJS course project by Coding in Flow",
    twitter: {
        card: "summary_large_image"
    }
}

export default function RootLayout(
    { children }: { children: React.ReactNode }
) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthModalsProvider>
                    <NavBar />
                    <main>
                        <Container className="py-4">
                            {children}
                        </Container>
                    </main>
                    <Footer />
                    <Suspense>
                        <OnboardingRedirect />
                    </Suspense>
                </AuthModalsProvider>
            </body>
        </html>
    )
}
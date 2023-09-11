import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';
import AuthModalsProvider from '@/components/auth/AuthModalsProvider';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';
import styles from "@/styles/App.module.css";
import '@/styles/globals.scss';
import '@/styles/utils.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, SSRProvider } from "react-bootstrap";

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <title>Flow Blog - Share your ideas</title>
        <meta name="description" content="A full-stack NextJS course project by Coding in Flow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" key="og:image" content="https://flowblog.com/social_media_preview_image.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <SSRProvider>
        <AuthModalsProvider>
          <div className={inter.className}>
            <NavBar />
            <main>
              <Container className={styles.pageContainer}>
                <Component {...pageProps} />
              </Container>
            </main>
            <Footer />
          </div>
        </AuthModalsProvider>
      </SSRProvider>
    </>
  );
}
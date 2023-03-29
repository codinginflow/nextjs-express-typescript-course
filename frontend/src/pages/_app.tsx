import '@/styles/globals.scss';
import '@/styles/utils.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import { Container, SSRProvider } from "react-bootstrap";
import styles from "@/styles/App.module.css";
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import NextNProgress from "nextjs-progressbar";
import SignUpModal from '@/components/auth/SignUpModal';
import LoginModal from '@/components/auth/LoginModal';
import { useEffect, useState } from 'react';
import { User } from '@/models/user';
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {

  const { user, userLoading, userLoadingError, mutateUser } = useAuthenticatedUser();

  return (
    <>
      <Head>
        <title>Flow Blog - Share your ideas</title>
        <meta name="description" content="A full-stack NextJS course project by Coding in Flow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SSRProvider>
        <div className={inter.className}>
          <NextNProgress color='#21FA90' />
          <NavBar />
          <div>{user?.username}</div>
          <main>
            <Container className={styles.pageContainer}>
              <Component {...pageProps} />
            </Container>
          </main>
          <Footer />
        </div>
      </SSRProvider>
    </>
  );
}

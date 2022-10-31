import '../assets/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { Header } from 'components';
import Head from 'next/head';

export const CLIENT_ID =
  '403286583639-j377nck3dof5f4mm15t48pjbvoq09fie.apps.googleusercontent.com';
export const CLIENT_PASSWORAD = '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';

const App = ({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps<{
  session: Session;
}>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity }
    }
  });

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Head>
          <title>Kdong-Commerce Service</title>
          <meta
            name="description"
            content="Fastcampus Kdong Commerce Service"
          />
        </Head>
        <div className="px-36">
          <Header />
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;

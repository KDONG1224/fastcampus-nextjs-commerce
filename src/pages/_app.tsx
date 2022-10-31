import '../assets/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { Header } from 'components';
import Head from 'next/head';

export const CLIENT_ID =
  '403286583639-3rrgsnpt2r2jcfdhlknlqg09sabst7tk.apps.googleusercontent.com';
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

import '../assets/styles/globals.css';
import type { AppContext, AppInitialProps, AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { Header } from 'components';

export const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;
export const CLIENT_PASSWORAD =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_PASSWORD;

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
        <div className="px-36">
          <Header />
          <Component {...pageProps} />
        </div>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;

import '../assets/styles/globals.css';
import type { AppContext, AppInitialProps, AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { Header } from 'components';

export const CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ??
  '403286583639-3rrgsnpt2r2jcfdhlknlqg09sabst7tk.apps.googleusercontent.com';
export const CLIENT_PASSWORAD =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_PASSWORD ??
  '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';

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

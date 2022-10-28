import '../assets/styles/globals.css';
import type { AppContext, AppInitialProps, AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { NextComponentType } from 'next';

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
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default App;

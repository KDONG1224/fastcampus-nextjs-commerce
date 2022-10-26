import '../assets/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

function MyApp({ Component, pageProps }: AppProps) {
  const CLIENT_ID =
    (process.env.GOOGLE_OAUTH_CLIENT_ID as string) ||
    '403286583639-3rrgsnpt2r2jcfdhlknlqg09sabst7tk.apps.googleusercontent.com';

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity }
    }
  });

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default MyApp;

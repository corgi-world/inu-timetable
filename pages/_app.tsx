import type { AppProps } from 'next/app';
import GlobalStyles from '../styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';

import Head from 'next/head';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '@/styles/createEmotionCache';

import { useState } from 'react';
import {
  DehydratedState,
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';

const clientSideEmotionCache = createEmotionCache();

import type { NextComponentType, NextPageContext } from 'next';

type NextPageWithLayout = NextComponentType<NextPageContext, any, any> & {
  getLayout?: (page: JSX.Element) => JSX.Element;
};

interface MyAppProps
  extends AppProps<{ dehydratedState: DehydratedState; session: Session }> {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
}

function MyApp({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MyAppProps) {
  const [queryClient] = useState(() => new QueryClient());

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <Hydrate state={pageProps.dehydratedState}>
            <SessionProvider session={pageProps.session}>
              {getLayout(<Component {...pageProps} />)}
            </SessionProvider>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;

import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';

async function getIsAuth(req?: IncomingMessage) {
  const session = await getSession({ req });

  return !!session;
}

export async function redirectAuthUser(req?: IncomingMessage) {
  const isAuth = await getIsAuth(req);
  if (isAuth) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export async function redirectNotAuthUser(req?: IncomingMessage) {
  const isAuth = await getIsAuth(req);
  if (!isAuth) {
    const query = encodeURI('message=로그인이 필요합니다.&isError=true');
    return {
      redirect: {
        destination: `/signin?${query}`,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

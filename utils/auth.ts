import { IncomingMessage } from 'http';
import { getSession } from 'next-auth/react';

export async function redirectAuthUser(req?: IncomingMessage) {
  const session = await getSession({ req });
  if (session) {
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
  const session = await getSession({ req });
  if (!session) {
    const query = encodeURI('message=로그인이 필요합니다.&isError=true');
    return {
      redirect: {
        destination: `/signin?${query}`,
        permanent: false,
      },
    };
  }

  return { user: session.user };
}

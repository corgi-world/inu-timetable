import NextAuth from 'next-auth/next';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import client from '@/prisma/client';

const authOptions: NextAuthOptions = {
  secret: 'mswisking',
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { id, password } = credentials as {
          id: string;
          password: string;
        };

        const { user, message } = await findUser(id, password);
        if (user) {
          return { id, nickname: user.nickname };
        }

        throw new Error(message);
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      const { id, nickname } = token.user as {
        id: string;
        nickname: string;
      };
      session.user = { email: id, name: nickname };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
};

async function findUser(id: string, password: string) {
  const user = await client.user.findUnique({
    where: {
      id,
    },
  });

  if (user) {
    if (password === user.password) {
      return { user, message: '' };
    } else {
      return { user: null, message: '비밀번호가 틀렸습니다.' };
    }
  }

  return { user: null, message: '존재하지 않는 아이디입니다.' };
}

export default NextAuth(authOptions);

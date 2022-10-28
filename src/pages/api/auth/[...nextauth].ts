import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { CLIENT_ID, CLIENT_PASSWORAD } from 'pages/_app';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_PASSWORAD
    })
  ],
  session: {
    strategy: 'database',
    maxAge: 1 * 24 * 60 * 60
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.id = user.id;
      return Promise.resolve(session);
    }
  },
  debug: true
};

export default NextAuth(authOptions);

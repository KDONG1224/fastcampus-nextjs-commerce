import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId:
        '403286583639-j377nck3dof5f4mm15t48pjbvoq09fie.apps.googleusercontent.com',
      clientSecret: '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'
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

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
        '403286583639-3rrgsnpt2r2jcfdhlknlqg09sabst7tk.apps.googleusercontent.com',
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

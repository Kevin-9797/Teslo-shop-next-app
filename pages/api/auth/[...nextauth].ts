import { dbUsers } from '@/database';
import NextAuth, { NextAuthOptions, User } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';



export const authOptions : NextAuthOptions = {
  providers: [
    // OAuth authentication providers...

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@google.com' },
        password: { label: 'Password', type: 'password', placeholder: 'password' },

      },
      async authorize (credentials) {
        console.log(credentials?.email);
        return await dbUsers.checkUserEmailPassword( credentials!.email,credentials!.password) as any ;
      }
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
  ],
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },
  session: {
    maxAge: 2592000, // duracion de la session de un mes
    strategy: 'jwt',
    updateAge: 86400 // cada dia se actualizara
  },
  callbacks: {
    async jwt({ token, account,user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser( user.email || '',user.name || '' );
            console.log(token)

            break;
          case 'credentials':
            token.user = user 
            break;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken as string;
      return session;
    }
  }
}

export default NextAuth(authOptions);
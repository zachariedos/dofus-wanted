import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const Google = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google]
});

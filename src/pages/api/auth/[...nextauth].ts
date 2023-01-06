import NextAuth, { AuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

import { query as q } from 'faunadb';
import { Fauna } from '../../../services/fauna';

const GITHUB_ID = process.env.GITHUB_ID as string;
const GITHUB_SECRET = process.env.GITHUB_SECRET as string;

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
  secret: process.env.SECRET,

  callbacks: {
    async signIn(data) {
      await Fauna.query(
        q.Create(q.Collection('users'), {
          data: {
            email: data.user.email,
            name: data.user.name,
            image: data.user.image,
          },
        })
      );
      return true;
    },
  },
};

export default NextAuth(authOptions);

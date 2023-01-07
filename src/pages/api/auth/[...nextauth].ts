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
        q.If(
          q.Not(
            q.Exists(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(data.user.email as string)
              )
            )
          ),
          q.Create(q.Collection('users'), {
            data: {
              email: data.user.email,
              name: data.user.name,
              image: data.user.image,
            },
          }),
          q.Get(
            q.Match(
              q.Index('user_by_email'),
              q.Casefold(data.user.email as string)
            )
          )
        )
      );
      return true;
    },
  },
};

export default NextAuth(authOptions);

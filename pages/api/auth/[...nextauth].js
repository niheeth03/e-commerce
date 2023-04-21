// pages/api/auth/[...nextauth].js

import bcryptjs from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User from '../../../models/User';
import Seller from '../../../models/Seller';
import Advertiser from '../../../models/Advertiser'
import db from '../../../utils/db';

export default NextAuth({
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?._id) token._id = user._id;
      if (user?.role) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token?._id) session.user._id = token._id;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await db.connect();
        let user = await User.findOne({
          email: credentials.email,
        });
        let seller = await Seller.findOne({
          email: credentials.email,
        });
        let advertiser = await Advertiser.findOne({
          email: credentials.email,
        });
        await db.disconnect();
        if (user && bcryptjs.compareSync(credentials.password, user.password)) {
          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: 'user',
          };
        }
        else if (seller && bcryptjs.compareSync(credentials.password, seller.password)) {
          return {
            _id: seller._id,
            name: seller.name,
            email: seller.email,
            role: 'seller',
          };
        }
        else if (advertiser && bcryptjs.compareSync(credentials.password, seller.password)) {
          return {
            _id: advertiser._id,
            name: advertiser.name,
            email: advertiser.email,
            role: 'advertiser',
          };
        }
        throw new Error('Invalid email or password');
      },
    }),
  ],
});

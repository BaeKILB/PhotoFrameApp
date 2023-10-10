// 구글 로그인 인증

import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

export const googleAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // 추가적인 스코프를 원한다면 아래와 같이 입력합니다.
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    }),
  ],
  // jwt 복호화를 위해 추가하는 문자열
  // 보통 사용하는 api 의 client secret 을 사용함
  secret: process.env.GOOGLE_CLIENT_SECRET,
  // 콜백 셋팅
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(googleAuthOptions);

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
    // 앨범 정보 추가하기
    async jwt({ token, trigger, account, session }) {
      // useSession으로 update 를사용시 앨범 데이터 들어가있는지 확인후 업데이트
      if (trigger === "update" && session?.albumId) {
        token.albumId = session.albumId;
      }
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      if (token.albumId) {
        session.albumId = token.albumId;
      }
      session.accessToken = token.accessToken;
      return session;
    },
  },
};

export default NextAuth(googleAuthOptions);

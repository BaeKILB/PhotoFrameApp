import Layout from "@/components/Layout";
import "@/styles/globals.css";

// next-auth 를 이용한 구글 로그인 인증 준비
import { SessionProvider } from "next-auth/react";

// next-auth 는 무조건 최상위(_app.js) 에 SessionProvider 를 노출해야함
export default function App({
  Component,
  //next-auth 이용시 pageProps 에 session 을 끼워 넣어야함
  pageProps: { session, ...pageProps },
}) {
  // 구글 로그인
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

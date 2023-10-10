// next-auth 로그인 버튼 셋팅

import { useSession, signIn, signOut } from "next-auth/react";

export default function LoginBtn({ data }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <a href="#" onClick={() => signOut()}>
          Sign out
        </a>
        <style jsx>
          {`
            a {
              font-weight: 600;
              font-size: 18px;
            }
          `}
        </style>
      </>
    );
  }
  return (
    <>
      <a href="#" onClick={() => signIn()}>
        Sign in
      </a>
      <style jsx>
        {`
          a {
            font-weight: 600;
            font-size: 18px;
          }
        `}
      </style>
    </>
  );
}

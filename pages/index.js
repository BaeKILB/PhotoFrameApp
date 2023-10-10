import Seo from "@/components/Seo";
import ImageBox from "@/components/ImageBox";

// 세션 사용을 위한 모듈(어느 앨범인지 기록)
import { IronSessionOptions } from "iron-session";

// 이미지 클릭시 이미지 디테일(확대 축소 스크린샷 등)
// 화면 구현해주는 모듈
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// 로그인 확인하기 위해 세션 체크
import { useSession, getSession } from "next-auth/react";

export default function Home(props) {
  // useSession() 이 반환해주는 data 를 session으로 이름 바꿔 넣기
  const { data: session } = useSession();

  const imageList = session ? (
    <>
      {props.imageData ? (
        props.imageData.map((e) => (
          <ImageBox key={e.filename} imgData={e}></ImageBox>
        ))
      ) : (
        <h2>상단 로고를 눌러 페이지를 다시 불러와 주세요</h2>
      )}
    </>
  ) : (
    <h2>로그인이 필요합니다</h2>
  );
  return (
    <>
      <Seo title="Main" />
      <main className="container">{imageList}</main>
      <style jsx>{`
        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 20px;
          gap: 20px;
        }

        .image h4 {
          font-size: 18px;
          text-align: center;
        }
      `}</style>
    </>
  );
}

// eslint-disable-next-line @next/next/no-typos
export async function getServerSideProps({ res, req }) {
  const session = await getSession({ req });
  console.log(session);
  if (session) {
    const token = session.accessToken;

    // 토큰 있으면 진행
    const response = await fetch("http://localhost:3000/api/loadImage", {
      method: "POST",
      body: JSON.stringify({
        token: token,
        parameters: {
          filters: {
            contentFilter: { includedContentCategories: ["PEOPLE"] },
            mediaTypeFilter: { mediaTypes: ["PHOTO"] },
          },
        },
      }),
      headers: {
        "content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
    if (response) {
      return {
        props: {
          imageData: data.photos,
        },
      };
    }
    return {
      props: {
        imageData: "",
      },
    };
  }
  return {
    props: {},
  };
}

Fancybox.bind('[data-fancybox="gallery"]', {
  //
});

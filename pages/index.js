import Seo from "@/components/Seo";
import ImageBox from "@/components/ImageBox";
import AlbumBox from "@/components/AlbumBox";

// 이미지 클릭시 이미지 디테일(확대 축소 스크린샷 등)
// 화면 구현해주는 모듈
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

// 로그인 확인하기 위해 세션 체크
import { useSession, getSession } from "next-auth/react";

export default function Home(props) {
  // useSession() 이 반환해주는 data 를 session으로 이름 바꿔 넣기
  const { data: session } = useSession();

  let listShow = <h2>상단 로고를 눌러 페이지를 다시 불러와 주세요</h2>;
  let listTopMsg = <div></div>;

  // 리스트에 들어갈 항목들
  if (session) {
    if (session.albumId && session.albumId != "") {
      listShow = props.imageData ? (
        props.imageData.map((e) => (
          <ImageBox key={e.filename} imgData={e}></ImageBox>
        ))
      ) : (
        <h2>상단 로고를 눌러 페이지를 다시 불러와 주세요</h2>
      );
    } else {
      listTopMsg = <h2 className="list_top">앨범을 선택해주세요</h2>;
      listShow = props.albums ? (
        props.albums.map((e) => <AlbumBox key={e.id} albumData={e}></AlbumBox>)
      ) : (
        <h2>상단 로고를 눌러 페이지를 다시 불러와 주세요</h2>
      );
    }
  } else {
    listShow = <h2>로그인이 필요합니다</h2>;
  }

  return (
    <>
      <Seo title="Main" />
      {listTopMsg}
      <main className="container">{listShow}</main>
      <style jsx>{`
        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 20px;
          gap: 20px;
        }
      `}</style>
    </>
  );
}

// eslint-disable-next-line @next/next/no-typos
export async function getServerSideProps({ res, req }) {
  const session = await getSession({ req });

  console.log("session");
  console.log(session);

  if (session) {
    const token = session.accessToken;
    if (!session.albumId || session.albumId === "") {
      const response = await fetch("http://localhost:3000/api/loadAlbum", {
        method: "POST",
        body: JSON.stringify({
          token: token,
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
            albums: data.albums,
          },
        };
      }
      return {
        props: {},
      };
    } else if (session.albumId && session.albumId != "") {
      // 토큰 있으면 진행
      const response = await fetch("http://localhost:3000/api/loadImage", {
        method: "POST",
        body: JSON.stringify({
          token: token,
          parameters: {
            albumId: session.albumId,
          },
        }),
        headers: {
          "content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      if (data.photos) {
        if (data.photos.length > 0) {
          return {
            props: {
              imageData: data.photos,
            },
          };
        } else {
          console.log("data.error.status");
          console.log(data.error.status);
          console.log(data.error.serverMessage);
        }
      }
    }
  }
  return {
    props: {},
  };
}

Fancybox.bind('[data-fancybox="gallery"]', {
  //
});

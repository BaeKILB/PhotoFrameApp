import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function AlbumBox(props) {
  const albumData = props.albumData;
  const { data: session, update } = useSession();
  const router = useRouter();
  return (
    <>
      <a
        href="#"
        className="image"
        key={albumData.id + "_album"}
        onClick={() => {
          update({ albumId: albumData.id });
          router.push("http://" + location.host);
        }}
      >
        <img src={albumData.coverPhotoBaseUrl} />
        <h4>{albumData.title}</h4>
      </a>

      <style jsx>
        {`
          .image img {
            max-width: 100%;
            border-radius: 12px;
            transition: transform 0.2s ease-in-out;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
          }
          .image:hover img {
            transition: transform 0.2s;
            transform: scale(1.05) translateY(-10px);
          }
          .image h4 {
            font-size: 18px;
            text-align: center;
          }
        `}
      </style>
    </>
  );
}

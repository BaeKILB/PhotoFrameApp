import Link from "next/link";

export default function ImageBox(props) {
  const imgData = props.imgData;
  return (
    <>
      <a
        href={
          imgData.baseUrl +
          "=w" +
          imgData.mediaMetadata.width +
          "-h" +
          imgData.mediaMetadata.height
        }
        data-fancybox="gallery"
        className="image"
        key={imgData.filename + "_img"}
      >
        <img src={imgData.baseUrl} />
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
        `}
      </style>
    </>
  );
}

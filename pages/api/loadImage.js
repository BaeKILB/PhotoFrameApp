import { getSession } from "next-auth/react";

// Custom error that contains a status, title and a server message.
class StatusError extends Error {
  constructor(status, title, serverMessage, ...params) {
    super(...params);
    this.status = status;
    this.statusTitle = title;
    this.serverMessage = serverMessage;
  }
}

// 날짜 객체로 반환
function constructDate(year, month, day) {
  const date = {};
  if (year) date.year = year;
  if (month) date.month = month;
  if (day) date.day = day;
  return date;
}

async function checkStatus(response) {
  if (!response.ok) {
    // Throw a StatusError if a non-OK HTTP status was returned.
    let message = "";
    try {
      // Try to parse the response body as JSON, in case the server returned a useful response.
      message = await response.json();
    } catch (err) {
      // Ignore if no JSON payload was retrieved and use the status text instead.
    }
    throw new StatusError(response.status, response.statusText, message);
  }

  // If the HTTP status is OK, return the body as JSON.
  return await response.json();
}

// Submits a search request to the Google Photos Library API for the given
// parameters. The authToken is used to authenticate requests for the API.
// The minimum number of expected results is configured in config.photosToLoad.
// This function makes multiple calls to the API to load at least as many photos
// as requested. This may result in more items being listed in the response than
// originally requested.
async function libraryApiSearch(authToken, parameters) {
  let photos = [];
  let nextPageToken = null;
  let error = null;

  parameters.pageSize = 100;

  console.log("parameters");
  console.log(parameters);
  console.log("authToken");
  console.log(authToken);
  try {
    // Loop while the number of photos threshold has not been met yet
    // and while there is a nextPageToken to load more items.
    do {
      // Make a POST request to search the library or album
      const searchResponse = await fetch(
        "https://photoslibrary.googleapis.com/v1/mediaItems:search",
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
          body: JSON.stringify(parameters),
        }
      );
      const result = await checkStatus(searchResponse);

      // The list of media items returned may be sparse and contain missing
      // elements. Remove all invalid elements.
      // Also remove all elements that are not images by checking its mime type.
      // Media type filters can't be applied if an album is loaded, so an extra
      // filter step is required here to ensure that only images are returned.
      const items =
        result && result.mediaItems
          ? result.mediaItems
              .filter((x) => x) // Filter empty or invalid items.
              // Only keep media items with an image mime type.
              .filter((x) => x.mimeType && x.mimeType.startsWith("image/"))
          : [];

      photos = photos.concat(items);

      // Set the pageToken for the next request.
      parameters.pageToken = result.nextPageToken;

      // Loop until the required number of photos has been loaded or until there
      // are no more photos, ie. there is no pageToken.
    } while (photos.length < 150 && parameters.pageToken != null);
  } catch (err) {
    // Log the error and prepare to return it.
    error = err;
    console.log(error);
  }

  console.log("Search complete.");
  return { photos, parameters, error };
}

// 서버 동작
// 받는데이터
// id , productUrl : 구글 포토 url
// baseUrl : 실질적인 이미지 url
// mimeType: 이미지 타입
// mediaMetadata: 이미지 정보 객체
// filename : 원본 파일이름
export default async function loadImage(req, res) {
  if (req.method === "POST") {
    const token = req.body.token;
    const parameters = req.body.parameters;
    // Make a POST request to search the library or album
    if (!token) {
      res.status(401).json({ msg: "error : no token" });
      return;
    }

    const data = await libraryApiSearch(token, parameters);

    console.log("sand data");
    res.status(200).json(data);
    return;
  }
  res.status(401).json({ msg: "data load error" });
}

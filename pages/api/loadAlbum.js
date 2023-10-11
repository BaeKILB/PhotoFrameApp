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
async function libraryApiAlbum(authToken) {
  let albums = [];
  let nextPageToken = null;
  let error = null;

  try {
    // Loop while the number of photos threshold has not been met yet
    // and while there is a nextPageToken to load more items.

    const searchResponse = await fetch(
      "https://photoslibrary.googleapis.com/v1/albums",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authToken,
        },
      }
    );
    const result = await checkStatus(searchResponse);
    if (result.albums) {
      albums = result.albums;
    }
  } catch (err) {
    // Log the error and prepare to return it.
    error = err;
    console.log(error);
  }

  console.log("Search complete.");
  return { albums, error };
}

// 서버 동작
// 받는데이터
// albums : 앨범 리스트
export default async function loadAlbum(req, res) {
  if (req.method === "POST") {
    const token = req.body.token;
    const parameters = req.body.parameters;
    // Make a POST request to search the library or album
    if (!token) {
      res.status(401).json({ msg: "error : no token" });
      return;
    }

    const data = await libraryApiAlbum(token);

    console.log("sand data");
    res.status(200).json(data);
    return;
  }
  res.status(401).json({ msg: "data load error" });
}

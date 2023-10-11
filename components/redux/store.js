import { createSlice } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
const albumSlice = createSlice({
  name: "albumData",
  initialState: {
    id: "",
    title: "",
    productUrl: "",
    mediaItemsCount: "",
    coverPhotoBaseUrl: "",
    coverPhotoMediaItemId: "",
  },
  reducers: {
    setAlbumData(state, action) {
      state = action.payload;
    },
  },
});

const store = configureStore({
  reducer: {
    albumData: albumSlice.reducer,
  },
});
export const albumAction = albumSlice.actions;
export default store;

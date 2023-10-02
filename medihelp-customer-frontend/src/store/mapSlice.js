import {createSlice} from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    latitude: null,
    longitude: null,
  },
  reducers: {
    setLocation(state, action) {
      state.latitude = action.payload.location.latitude;
      state.longitude = action.payload.location.longitude;
      console.log(state,action);
    },
  },
});

export const setMap = mapSlice.actions;

export default mapSlice;

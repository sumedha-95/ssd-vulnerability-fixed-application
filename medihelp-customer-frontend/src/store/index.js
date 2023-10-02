import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import mapSlice from "./mapSlice";

const reducers = combineReducers({
  auth: authSlice.reducer,
  map: mapSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export default store;

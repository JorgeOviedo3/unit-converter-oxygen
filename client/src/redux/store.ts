import { configureStore } from "@reduxjs/toolkit";
import conversionsReducer from "./conversionsSlice.ts";

export const store = configureStore({
  reducer: {
    conversions: conversionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

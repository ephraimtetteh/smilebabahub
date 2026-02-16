import { configureStore } from "@reduxjs/toolkit";
import authReducer  from "./features/userSlice";
import { api } from './api/api'
import { setupListeners } from "@reduxjs/toolkit/query";


export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefault) => getDefault().concat(api.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

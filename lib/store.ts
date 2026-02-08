import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/userSlice";
import { api } from '@/lib/api'
import { setupListeners } from "@reduxjs/toolkit/query";


export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefault) => getDefault().concat(api.middleware),
  });
}

setupListeners(makeStore.dispatch);

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

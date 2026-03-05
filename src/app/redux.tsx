'use client'

import { useDispatch, useSelector, TypedUseSelectorHook, Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { useRef } from "react";
import authReducer from "@/src/lib/features/auth/authSlice";
import globalReducer from '@/src/lib'
import { api } from "../lib/api/api";

// REDUX PERSISTENECE
const createNoopStorage = () => {
  return {
    getItem(_key: any){
      return Promise.resolve(null)
    },
    setItem(_key: any, value: any){
      return Promise.resolve(value)
    },
    removeItem(_key: any){
      return Promise.resolve()
    },
  };
};

const storage = typeof window === 'undefined'
  ? createNoopStorage()
  : createWebStorage('local');

const persistConfig = {
  key: 'rook',
  storage,
  whitelist: ['global']
}

const rootReducer = combineReducers({
  auth: authReducer,
  global: globalReducer,
  [api.reducerPath]: api.reducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


// REDUX STORE 
export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware)
  });
}

// --------- REDUX TYPES
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;



// PROVIDER
export default function StoreProvider({ children }: {children: React.ReactNode}) {
  const storeRef = useRef<AppStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch)
    // storeRef.current.dispatch(setRegisterState(user));
  }
  const persistor = persistStore(storeRef.current)
  
  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
      {children}
      </PersistGate>
    </Provider>);
}






































// export const makeStore = () => {
//   return configureStore({
//     reducer: {
//       auth: authReducer,
//       [api.reducerPath]: api.reducer,
//     },
//     middleware: (getDefault) => getDefault().concat(api.middleware),
//   });
// };
'use client'
import { useRef } from "react"
import { Provider } from "react-redux"
import { makeStore, AppStore } from "@/lib/store";
import { setRegisterState } from "@/lib/features/userSlice";
import { StoreProviderProps } from "@/types/types";


export default function StoreProvider({user, children}: StoreProviderProps){
  const storeRef = useRef<AppStore | null>(null)
  if(storeRef.current === null){
    storeRef.current = makeStore()
    storeRef.current.dispatch(setRegisterState(user))
  }

  return ( 
    <Provider store={storeRef.current}>
      {children}
    </Provider>);
}
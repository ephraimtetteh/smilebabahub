import axios, { AxiosError } from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

import { setIsAuthenticated, setIsAuthenticating, setAccessToken, setUser, setMessage } from "./userSlice";
import { toast } from "react-toastify";

export const login = createAsyncThunk('/smilebaba/auth/login', 
  async(user: any, {dispatch}) => {
    dispatch(setIsAuthenticating(true))

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}`, user)

      if(!res?.data?.data) {
        toast.error('User not Found')
      }

      const accessToken = res.data.data

      dispatch( validateUser(accessToken))

    } catch (error) {
      const err = error as AxiosError<any>;

      dispatch(setIsAuthenticated(false))
      dispatch(setAccessToken(null))
      dispatch(setUser({}))
      dispatch(
        setMessage({
          type: "error",
          message: err?.response?.data?.message || "Something went wrong",
        }),
      );
      dispatch(setIsAuthenticating(false))
    }
})

export const validateUser = createAsyncThunk('/smilebaba/auth/refresh', 
  async(accessToken: any, { dispatch }) => {
    dispatch(setIsAuthenticating(true))

    try {
      if(!accessToken){
        toast.error('User Not Found')
      }

      const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}`, {headers: {Authorization: `Bearer ${ accessToken }`}})

      if(!res?.data?.user){
        toast.error('User Not Found')
      }

      const user = res.data.user

      cookieStore.set('accessToken', accessToken)
      cookieStore.set('user', JSON.stringify(user))

      dispatch(setIsAuthenticated(true))
      dispatch( setAccessToken(accessToken))
      dispatch( setUser(user))

      dispatch(setIsAuthenticating(false))

    } catch (error) {
      console.log(error)
      dispatch(setIsAuthenticated(false));
      dispatch(setAccessToken(null));
      dispatch(setUser({}));
      dispatch(setIsAuthenticating(false));
    }
})


export const logout = createAsyncThunk('/smilebaba/auth/logout',
   async(e, {dispatch}) => {
    dispatch(setIsAuthenticating(true))
    cookieStore.delete("accessToken");


    dispatch(setIsAuthenticated(false))
    dispatch(setUser({}))
    dispatch(setAccessToken(null))
    dispatch(setIsAuthenticating(false))
})
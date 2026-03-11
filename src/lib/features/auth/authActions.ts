import { createAsyncThunk } from "@reduxjs/toolkit";
import { setIsAuthenticated, setIsAuthenticating, setAccessToken, setUser, setMessage } from "./authSlice";
import axiosInstance from "../../api/axios";
import getErrorMessage from "@/src/utils/getErrorMessage";



export const register = createAsyncThunk(
  "/smilebaba/auth/register",
  async (
    userData: {
      username: string;
      email: string;
      password: string;
      phone: string;
    },
    { dispatch, rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.post("/auth/register", userData);

      dispatch(setUser(res.data.user));
      dispatch(setIsAuthenticated(true));

      return res.data;
    } catch (error) {
      const message = getErrorMessage(error);
      dispatch(setMessage({ type: "error", message }));
      return rejectWithValue(message);
    }
  },
);

export const verifyOTP = createAsyncThunk(
  "/auth/verifyOtp",
  async (data: { phone: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);


export const resendOTP = createAsyncThunk(
  "/auth/resendOtp",
  async (phone: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/resend-otp", { phone });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

export const login = createAsyncThunk('/smilebaba/auth/login', 
  async(user: any, {dispatch}) => {

    
    try {
      dispatch(setIsAuthenticating(true))
      const res = await axiosInstance.post('/auth/login', user)


      //dispatch( validateUser(accessToken))
      dispatch(setUser(res.data.user));
      dispatch(setIsAuthenticated(true));

    } catch (error) {
      dispatch(setIsAuthenticated(false))
      dispatch(setAccessToken(null))
      dispatch(setUser({}))
      dispatch(
        setMessage({
          type: "error",
          message: getErrorMessage(error),
        }),
      );
    }
    finally {
      dispatch(setIsAuthenticating(false))
    }
})

// export const validateUser = createAsyncThunk('/smilebaba/auth/refresh', 
//   async(accessToken: any, { dispatch }) => {
//     dispatch(setIsAuthenticating(true))

//     try {
//       if(!accessToken){
//         toast.error('User Not Found')
//       }

//       const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}`, {headers: {Authorization: `Bearer ${ accessToken }`}})

//       if(!res?.data?.user){
//         toast.error('User Not Found')
//       }

//       const user = res.data.user

//       cookieStore.set('accessToken', accessToken)
//       cookieStore.set('user', JSON.stringify(user))

//       dispatch(setIsAuthenticated(true))
//       dispatch( setAccessToken(accessToken))
//       dispatch( setUser(user))

//       dispatch(setIsAuthenticating(false))

//     } catch (error) {
//       console.log(error)
//       dispatch(setIsAuthenticated(false));
//       dispatch(setAccessToken(null));
//       dispatch(setUser({}));
//       dispatch(setIsAuthenticating(false));
//     }
// })

export const validateUser = createAsyncThunk(
  "/smilebaba/auth/me",
  async (_, { dispatch }) => {
    try {
      const res = await axiosInstance.get("/auth/me");

      dispatch(setUser(res.data.user));
      dispatch(setIsAuthenticated(true));
    } catch {
      dispatch(setIsAuthenticated(false));
    }
  },
);


export const logout = createAsyncThunk('/smilebaba/auth/logout',
   async(_, {dispatch}) => {
    dispatch(setIsAuthenticating(true))
    await axiosInstance.post("/auth/logout");

    dispatch(setUser({}));
    dispatch(setIsAuthenticated(false));
})
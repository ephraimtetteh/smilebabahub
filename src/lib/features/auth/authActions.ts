import { createAsyncThunk } from "@reduxjs/toolkit";
import { setIsAuthenticated, setIsAuthenticating, setAccessToken, setUser, setMessage } from "./authSlice";
import axiosInstance from "../../api/axios";
import getErrorMessage from "@/src/utils/getErrorMessage";
import { LoginResponseProp, RegisterResponseProp, UserProp } from "@/src/types/types";



export const register = createAsyncThunk<
  RegisterResponseProp,
  {
    username: string;
    email: string;
    password: string;
    phone: string;
  },
  { rejectValue: string }
>(
  "/smilebaba/auth/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.post<RegisterResponseProp>(
        "/auth/register",
        userData,
      );

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

export const login = createAsyncThunk<
  LoginResponseProp,
  {
    email: string;
    password: string;
  }
>("/smilebaba/auth/login", async (userData, { dispatch }) => {
  try {
    dispatch(setIsAuthenticating(true));

    const response = await axiosInstance.post<LoginResponseProp>(
      "/auth/login",
      userData,
    );

    // dispatch(
    //   setUser({
    //     username: response.data.username,
    //     email: response.data.email,
    //     phone: response.data.phone,
    //     role: response.data.role,
    //     profilePicture: response.data.profilePicture,
    //     cartItems: response.data.cartItems,
    //   }),
    // );
    dispatch(setUser(response.data.user));
    dispatch(setIsAuthenticated(true));
    return response.data;
  } catch (error) {
    dispatch(setIsAuthenticated(false));
    dispatch(setAccessToken(null));
    dispatch(setUser(null));

    dispatch(
      setMessage({
        type: "error",
        message: getErrorMessage(error),
      }),
    );

    throw error;
  } finally {
    dispatch(setIsAuthenticating(false));
  }
});


export const forgotPassword = createAsyncThunk(
  "/auth/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);


export const restoreSession = createAsyncThunk<
   UserProp,
  void,
  { rejectValue: string }
>("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post("/auth/refresh");

    const response = await axiosInstance.get("/auth/me");

    return response.data.user;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error));
  }
});



export const resetPassword = createAsyncThunk(
  "/auth/resetPassword",
  async (
    { token, password }: { token: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await axiosInstance.post("/auth/reset-password", {
        token,
        password,
      });

      return res.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);


export const validateUser = createAsyncThunk(
  "/smilebaba/auth/me",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/auth/me");

      dispatch(setUser(res.data.user));
      dispatch(setIsAuthenticated(true));
      return res.data.user;
    } catch(error) {
      dispatch(setIsAuthenticated(false));
      return rejectWithValue(getErrorMessage(error));
    }
  },
);


export const logout = createAsyncThunk(
  "/smilebaba/auth/logout",
  async (_, { dispatch }) => {
    try {
      dispatch(setIsAuthenticating(true));

      await axiosInstance.post("/auth/logout");

      dispatch(setUser(null));
      dispatch(setAccessToken(null));
      dispatch(setIsAuthenticated(false));
    } finally {
      dispatch(setIsAuthenticating(false));
    }
  },
);



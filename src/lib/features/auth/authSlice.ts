import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserProp } from "@/src/types/types";
import { register, restoreSession } from "./authActions";


interface Message {
  type: string,
  message: string
}
declare interface authState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  accessToken: null | string;
  user: UserProp | null;
  message: Message;
  isLoading: boolean;
}

const initialState: authState = {
 isAuthenticated: false,
 isAuthenticating: true,
 accessToken: null,
 user: null,
 message: {
  type: '',
  message: ''
 },
 isLoading: true
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload
    },

    setAccessToken: (state, action: PayloadAction<null | string>) => {
      state.accessToken = action.payload
    },

    setUser: (state, action: PayloadAction<UserProp | null>) => {
      state.user = action.payload;
    },

    setMessage: (state, action: PayloadAction<Message>) => {
      state.message = action.payload
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(restoreSession.pending, (state) => {
        state.isAuthenticating = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isAuthenticating = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  }
})

export const {
  setIsAuthenticated, setIsAuthenticating, setAccessToken, setUser, setMessage
} = authSlice.actions;

const authReducer = authSlice.reducer
export default authReducer;


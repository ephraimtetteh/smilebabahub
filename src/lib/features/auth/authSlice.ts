import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserProp } from "@/src/types/types";


interface Message {
  type: string,
  message: string
}
declare interface authState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  accessToken: null | string;
  user: UserProp;
  message: Message
  isLoading: boolean
 }

const initialState: authState = {
 isAuthenticated: false,
 isAuthenticating: true,
 accessToken: null,
 user: { 
  username: '',
   email: '',
   phone: '',
   role: '',
   country: '',
   state: '',
   profilePicture: '',
  },
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

    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload
    },
    setMessage: (state, action: PayloadAction<Message>) => {
      state.message = action.payload
    }
  },
})

export const {
  setIsAuthenticated, setIsAuthenticating, setAccessToken, setUser, setMessage
} = authSlice.actions;

const authReducer = authSlice.reducer
export default authReducer;


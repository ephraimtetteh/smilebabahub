export interface AuthState {
  user: any;
  accessToken: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  message?: {
    type: "success" | "error";
    message: string;
  };
}

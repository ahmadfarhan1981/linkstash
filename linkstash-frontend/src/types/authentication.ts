export type useAuthenticationReturnValue = {
    AuthenticationState: AuthenticationState;
    login: (username: string, password: string) => void;
    logout: () => void;
  };
  
  export type AuthenticationState = {
    isLoggedIn: boolean;
    isPending: boolean;
    token: string;
    userId: string;
  };
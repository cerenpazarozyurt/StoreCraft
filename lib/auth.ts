import { api } from "@/lib/api";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  image: string;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  return api.get<CurrentUser>("/auth/me");
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return api.post<LoginResponse>("/auth/login", {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 60,
  });
}
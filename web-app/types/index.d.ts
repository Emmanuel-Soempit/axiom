export interface Project {
  id: string;
  name: string;
}

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  project?: Project;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  error?: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export type AuthResponse = ApiResponse<AuthResponseData>;

export interface SwitchProjectResponseData {
  user: User;
  token: string;
}

export type SwitchProjectResponse = ApiResponse<SwitchProjectResponseData>;

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

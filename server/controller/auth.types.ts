export interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
  role?: "user" | "manager" | "admin";
  isApproved?: boolean;
}

export interface RegisterResponseBody {
  message: string;
}

import { ApiResponse } from "./common-protocol";
import { User as MUser } from "@malagu/security";

export interface User extends MUser {
  id: number;
  username: string;
  email: string;
  password: string;
  create_time: number;
  is_delete?: boolean;
}

export type UserInfo = Pick<
  User,
  "username" | "email" | "create_time" | "is_delete"
>;

export interface CustomSecurityContext {
  authentication: {
    principal: User;
  };
}

export const UserServer = Symbol("UserServer");
export interface UserServer {
  getUserList(): Promise<ApiResponse<User[]>>;
  getUser(username: string): Promise<ApiResponse<UserInfo>>;
  createUser(user: Partial<User>): Promise<ApiResponse>;
  deleteUser(id: string): Promise<ApiResponse>;
}

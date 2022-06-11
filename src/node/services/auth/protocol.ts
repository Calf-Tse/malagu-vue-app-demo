import { CustomError } from "@malagu/core";
import { User } from "../../../common/user-protocol";

export interface UserService<R, U extends User> {
  load(userRequest: R, usingID?: boolean): Promise<U>;
}

export class CuntomAuthError extends CustomError {
  constructor(message?: string) {
    super(message);
  }
}

export class AuthFailError extends CuntomAuthError {}

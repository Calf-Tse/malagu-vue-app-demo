import "./welcome-server";
import "./user-server";

// 登录授权服务组件
import "./services/auth/user-middleware";
import "./services/auth/user-service";
import "./services/auth/auth-provider";
import "./services/auth/auth-success-handle";
import "./services/auth/auth-error-handle";

import "./services/logger/logger";

import * as entities from "./entities";
import { autoBindEntities } from "@malagu/typeorm";

import { autoBind } from "@malagu/core";
export default autoBind();
autoBindEntities(entities);

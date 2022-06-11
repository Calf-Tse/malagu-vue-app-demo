import { Context, AttributeScope } from "@malagu/web/lib/node";
import { Rpc } from "@malagu/rpc";
import { ApiResponse } from "../common/common-protocol";
import {
  CustomSecurityContext,
  User,
  UserInfo,
  UserServer,
} from "../common/user-protocol";
import { User as MUser } from "@malagu/security";
import { OrmContext, Transactional } from "@malagu/typeorm/lib/node";
import { User as UserRepo } from "./entities";
import { Autowired, Logger } from "@malagu/core";
import { PasswordEncoder } from "@malagu/security/lib/node";
import { ILogger } from "./services/logger/protocol";

@Rpc(UserServer)
export class UserServerImpl implements UserServer {
  @Autowired(Logger)
  readonly logger!: ILogger;

  @Autowired(PasswordEncoder)
  protected readonly passwordEncoder!: PasswordEncoder;

  getBase(methodName?: string): {
    traceId: string;
    authInfo: User & MUser;
    prefix: string;
  } {
    const traceId = Context.getTraceId();
    const prefix = `UserServerImpl.${methodName}`;
    const authInfo = Context.getAttr<CustomSecurityContext>(
      "CurrentSecurityContextRequest",
      AttributeScope.Request
    ).authentication.principal;
    return { traceId, authInfo: authInfo as User & MUser, prefix };
  }

  async getUserList(): Promise<ApiResponse<User[]>> {
    return {
      code: 0,
      msg: "success",
    };
  }

  @Transactional({ readOnly: true })
  async getUser(username: string): Promise<ApiResponse<UserInfo>> {
    const { authInfo, prefix } = this.getBase("getUser");
    if (!authInfo.username) {
      return { code: 1, msg: "用户未登录" };
    }
    this.logger.info(
      `用户{${authInfo.username}}查找用户信息: ${username}`,
      prefix
    );
    const userRepo = OrmContext.getRepository(UserRepo);
    const userInfo = await userRepo.findOne(
      { username },
      {
        select: ["id", "create_time", "email", "is_delete", "username"],
      }
    );

    return {
      code: 0,
      msg: "success",
      data: userInfo,
    };
  }

  @Transactional()
  async createUser(user: Partial<User>): Promise<ApiResponse> {
    const { prefix } = this.getBase("createUser");
    this.logger.info(`创建用户: ${JSON.stringify(user)}`, prefix);
    user.password = await this.passwordEncoder.encode(user.password!);
    const userRepo = OrmContext.getRepository(UserRepo);
    const insertResult = await userRepo.insert(UserRepo.create(user));
    this.logger.info(`insertResult: ${JSON.stringify(insertResult)}`, prefix);

    return {
      code: 0,
      msg: "success",
    };
  }

  @Transactional()
  async deleteUser(id: string): Promise<ApiResponse> {
    const { prefix } = this.getBase("deleteUser");
    this.logger.info(`删除用户: ${JSON.stringify(id)}`, prefix);
    const userRepo = OrmContext.getRepository(UserRepo);
    const updateResult = await userRepo.update(id, {
      is_delete: true,
      update_time: Math.floor(Date.now() / 1000),
    });
    this.logger.info(`updateResult: ${JSON.stringify(updateResult)}`, prefix);
    if (updateResult.affected !== 1) {
      return {
        code: 1,
        msg: "删除用户失败",
      };
    }
    return {
      code: 0,
      msg: "success",
    };
  }
}

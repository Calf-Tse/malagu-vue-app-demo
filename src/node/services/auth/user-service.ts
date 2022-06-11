import { Autowired, Component, Logger } from "@malagu/core";
import { UserType } from "@malagu/security";
import { AuthFailError, UserService } from "./protocol";
import { UserService as MUserService } from "@malagu/security/lib/node";
import { OrmContext, Transactional } from "@malagu/typeorm/lib/node";
import { User as UserRepo } from "../../entities";
import { User } from "../../../common/user-protocol";
import { ILogger } from "../logger/protocol";

@Component({ id: MUserService, rebind: true })
export class UserServiceImpl implements UserService<string, User> {
  @Autowired(Logger)
  readonly logger!: ILogger;

  @Transactional({ readOnly: true })
  async load(account: string, usingID: boolean = false): Promise<User> {
    const prefix = "UserServiceImpl.load";
    this.logger.info(`查找用户: ${account}`, prefix);
    let userrepo = OrmContext.getRepository(UserRepo);
    let usermsg = await userrepo.findOne({
      where: [{ username: account }, { email: account }],
    });
    this.logger.info(
      `用户查找结果: ${usermsg?.id}, ${usermsg?.username}, ${usermsg?.email}`,
      prefix
    );
    if (!usermsg) {
      throw new AuthFailError(`找不到用户: ${account}`);
    }
    return {
      type: UserType.Database,
      accountNonExpired: true,
      accountNonLocked: true,
      credentialsNonExpired: true,
      enabled: !usermsg.is_delete,
      policies: [],
      ...usermsg,
    };
  }
}

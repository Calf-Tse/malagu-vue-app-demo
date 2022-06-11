import { Autowired, Component, Value, Logger } from "@malagu/core";
import { Context, RequestMatcher } from "@malagu/web/lib/node";
import {
  AuthenticationProvider,
  UserChecker,
  Authentication,
  PasswordEncoder,
} from "@malagu/security/lib/node";
import { UserService as MUserService } from "@malagu/security/lib/node";
import { AuthFailError, UserService } from "./protocol";
import { User } from "../../../common/user-protocol";
import { ILogger } from "../logger/protocol";

@Component({ id: AuthenticationProvider, rebind: true })
export class AuthenticationProviderImpl implements AuthenticationProvider {
  @Value("malagu.security")
  protected readonly options: any;

  @Autowired(MUserService)
  protected readonly userservice!: UserService<string, User>;

  @Autowired(PasswordEncoder)
  protected readonly passwordEncoder!: PasswordEncoder;

  @Autowired(UserChecker)
  protected readonly userChecker!: UserChecker;

  @Autowired(RequestMatcher)
  protected readonly requestMatcher!: RequestMatcher;

  @Autowired(Logger)
  protected readonly logger!: ILogger;

  priority = 2000;

  async authenticate(): Promise<Authentication> {
    const prefix = "AuthenticationProviderImpl.authenticate";
    const username = this.doGetValue(this.options.usernameKey);
    const password = this.doGetValue(this.options.passwordKey);
    this.logger.info(`用户登录: ${username}, ${password}`, prefix);
    if (!password || !username) {
      throw new AuthFailError("缺少用户名或密码");
    }
    const user = await this.userservice.load(username);
    if (!(await this.passwordEncoder.matches(password, user.password))) {
      throw new AuthFailError("用户名或密码错误");
    }
    user.password = "";
    return {
      name: user.username,
      principal: user,
      credentials: "认证成功!",
      policies: user.policies,
      authenticated: true,
    };
  }

  protected doGetValue(key: string): string {
    const request = Context.getRequest();
    if (request.body) {
      return request.body[key];
    } else {
      return <string>request.query[key] || "";
    }
  }

  async support(): Promise<boolean> {
    return !!(await this.requestMatcher.match(
      this.options.loginUrl,
      this.options.loginMethod
    ));
  }
}

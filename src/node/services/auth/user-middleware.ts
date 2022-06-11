import { RequestMatcher, Middleware, Context } from "@malagu/web/lib/node";
import { Component, Autowired, Value, Logger } from "@malagu/core";
import { PathResolver, HttpHeaders, MediaType } from "@malagu/web";
import {
  USER_MIDDLEWARE_PRIORITY,
  SecurityContext,
} from "@malagu/security/lib/node";
import { UserService as MUserService } from "@malagu/security/lib/node";
import { User } from "../../../common/user-protocol";
import { UserService } from "./protocol";
import { ILogger } from "../logger/protocol";

@Component([UserMiddleware, Middleware])
export class UserMiddleware implements Middleware {
  @Value("malagu.security.userInfoEndpoint")
  protected readonly userInfoEndpoint: any;

  @Autowired(PathResolver)
  protected readonly pathResolver!: PathResolver;

  @Autowired(RequestMatcher)
  protected readonly requestMatcher!: RequestMatcher;

  @Autowired(MUserService)
  protected readonly userservice!: UserService<string, User>;

  @Autowired(Logger)
  readonly logger!: ILogger;

  async handle(ctx: Context, next: () => Promise<void>): Promise<void> {
    if (await this.canHandle()) {
      const auth = SecurityContext.getAuthentication();
      this.logger.info(
        `用户获取信息: ${auth.principal._id}`,
        "user-middleware"
      );
      if (auth.authenticated) {
        const userInfo = await this.userservice.load(auth.principal._id, true);

        ctx.response.setHeader(
          HttpHeaders.CONTENT_TYPE,
          MediaType.APPLICATION_JSON_UTF8
        );
        if (userInfo) userInfo.password = "";
        ctx.response.body = JSON.stringify(userInfo || {});
        return;
      } else return;
    }
    await next();
  }

  async canHandle(): Promise<boolean> {
    const { url, method } = this.userInfoEndpoint;
    return !!(await this.requestMatcher.match(
      await this.pathResolver.resolve(url),
      method
    ));
  }

  readonly priority: number = USER_MIDDLEWARE_PRIORITY + 1;
}

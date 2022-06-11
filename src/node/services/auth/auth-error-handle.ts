import { Autowired, Component, Value } from "@malagu/core";
import { ErrorHandler, Context, RedirectStrategy } from "@malagu/web/lib/node";
import { HttpStatus, HttpHeaders, XML_HTTP_REQUEST } from "@malagu/web";
import { AuthFailError } from "./protocol";

@Component([CuntomAuthErrorHandle, ErrorHandler])
export class CuntomAuthErrorHandle implements ErrorHandler {
  readonly priority: number = 1000;

  @Value("malagu.security.basic.realm")
  protected realm!: string;

  @Value("malagu.security.basic.enabled")
  protected readonly baseEnabled!: boolean;

  @Value("malagu.security.loginPage")
  protected loginPage!: string;

  @Autowired(RedirectStrategy)
  protected readonly redirectStrategy!: RedirectStrategy;
  canHandle(ctx: Context, err: Error): Promise<boolean> {
    return Promise.resolve(err instanceof AuthFailError);
  }
  async handle(ctx: Context, err: AuthFailError): Promise<void> {
    if (
      ctx.request.get(HttpHeaders.X_REQUESTED_WITH) !== XML_HTTP_REQUEST &&
      !this.baseEnabled
    ) {
      await this.redirectStrategy.send(this.loginPage);
      ctx.response.end(err.message);
    } else {
      if (this.baseEnabled) {
        ctx.response.setHeader(
          HttpHeaders.WWW_AUTHENTICATE,
          `Basic realm="${this.realm}"`
        );
      }
      ctx.response.statusCode = HttpStatus.UNAUTHORIZED;
      ctx.response.end(err.message);
    }
  }
}

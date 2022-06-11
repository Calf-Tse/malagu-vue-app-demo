import * as log from "loglevel";
import { Component, Value, Logger, LOGGER_CONFIG } from "@malagu/core";
import { Context } from "@malagu/web/lib/node";
import { ILogger } from "./protocol";

@Component({ id: Logger, rebind: true })
export class LoggerImpl implements ILogger {
  protected instance!: ILogger;

  constructor(@Value(LOGGER_CONFIG) protected readonly config: any) {
    if (config.level) {
      log.setLevel(config.level);
    } else {
      log.setLevel("error");
    }
  }

  getLogTime() {
    const time = new Date();
    return `[${time.getFullYear()}-${
      time.getMonth() + 1
    }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}]`;
  }

  messagePrefix(str: string) {
    if (Context.getCurrent()) {
      const traceId = Context.getTraceId();
      const time = this.getLogTime();
      // const path = Context.getRequest().path;
      if (str) str = ` executing ${str}`;
      return `${time}${traceId ? ` with [${traceId}]` : ""}${str}`;
    }
    return "";
  }

  error(message: any, prefix = "", context = ""): void {
    log.error("[error]", this.messagePrefix(prefix), message, context);
  }

  info(message: any, prefix = "", context = ""): void {
    log.info("[info]", this.messagePrefix(prefix), message, context);
  }

  warn(message: any, prefix = "", context = ""): void {
    log.warn("[warn]", this.messagePrefix(prefix), message, context);
  }

  debug(message: any, prefix = "", context = ""): void {
    log.debug("[debug]", this.messagePrefix(prefix), message, context);
  }
}

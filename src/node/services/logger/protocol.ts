export interface ILogger {
  info(message: any, prefix?: string, context?: string): void;
  error(message: any, prefix?: string, context?: string): void;
  warn(message: any, prefix?: string, context?: string): void;
  debug(message: any, prefix?: string, context?: string): void;
}

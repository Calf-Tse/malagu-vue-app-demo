export interface ApiResponse<T = undefined> {
  code: 0 | 1 | 2;
  msg: string;
  data?: T;
  err?: Error;
}

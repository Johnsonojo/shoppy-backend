export {};

declare global {
  namespace Express {
    interface Request {
      username: string;
      email: string;
      password: string;
      payload: object | any;
    }
  }
}

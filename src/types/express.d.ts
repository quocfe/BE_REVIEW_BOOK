import { User } from 'src/schemas/users.schema';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      decode_refresh_token?: Token;
    }
  }
}

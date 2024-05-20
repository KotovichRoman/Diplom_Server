import { User } from '../user/entities/user.entity';

export class JwtPayload {
  id: number;
  exp?: number;

  constructor(user: User) {
    this.id = user.id;
  }
}

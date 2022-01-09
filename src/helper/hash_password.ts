import * as argon2 from 'argon2';

export class PasswordHashHelper {
  static async hashPassword(password): Promise<string> {
    return argon2.hash(password);
  }

  static async comparePassword(rawPassword, hashPassword) {
    return argon2.verify(hashPassword, rawPassword);
  }
}

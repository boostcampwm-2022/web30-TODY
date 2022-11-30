import * as crypto from 'crypto';

export function getSalt(): Promise<string> {
  return new Promise((res, rej) => {
    crypto.randomBytes(32, (err, buf) => {
      if (err) rej(err);
      res(buf.toString('hex'));
    });
  });
}

export function getSecurePassword(
  password: string,
  salt: string,
): Promise<string> {
  return new Promise((res, rej) => {
    crypto.pbkdf2(password, salt, 10000, 32, 'sha512', (err, derivedKey) => {
      if (err) rej(err);
      res(derivedKey.toString('hex'));
    });
  });
}

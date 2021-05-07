import * as D from 'io-ts/Decoder';

import { pipe } from 'fp-ts/function';

export const userDecoder = pipe(
  D.struct({
    id: D.string,
    name: D.string,
    age: D.number,
    admin: D.boolean,
  }),
  D.intersect(D.partial({ email: D.string }))
);

export type UserModel = D.TypeOf<typeof userDecoder>;

export const usersPayload = D.struct({
  users: D.array(userDecoder),
});

export type UsersPayload = D.TypeOf<typeof usersPayload>;

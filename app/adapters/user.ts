import DS from 'ember-data';
import * as D from 'io-ts/Decoder';
import { usersPayload, UsersPayload } from 'ember-io-ts-demo/codecs/user';
import { pipe } from 'fp-ts/lib/function';
import { fold } from 'fp-ts/Either';

export default class UserAdapter extends DS.RESTAdapter {
  namespace = 'v1';

  handleResponse(
    status: number,
    headers: {},
    payload: unknown,
    requestData: {}
  ): {} {
    const onLeft = (errors: D.DecodeError) => {
      const errorMessage = D.draw(errors);
      console.log(errorMessage);

      return new DS.InvalidError([errorMessage]);
    };

    const onRight = (payload: UsersPayload) => {
      return super.handleResponse(status, headers, payload, requestData);
    };

    return pipe(payload, usersPayload.decode, fold(onLeft, onRight));
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    user: UserAdapter;
  }
}

import DS from 'ember-data';
import * as D from 'io-ts/Decoder';
import * as E from 'fp-ts/Either';

import {
  ProductsPayload,
  productsPayloadDecoder,
} from 'ember-io-ts-demo/codecs/product';
import { pipe } from 'fp-ts/lib/function';

export default class ProductAdapter extends DS.RESTAdapter {
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

    const onRight = (payload: ProductsPayload) => {
      return super.handleResponse(status, headers, payload, requestData);
    };

    return pipe(
      payload,
      productsPayloadDecoder.decode,
      E.fold(onLeft, onRight)
    );
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your adapters.
declare module 'ember-data/types/registries/adapter' {
  export default interface AdapterRegistry {
    product: ProductAdapter;
  }
}

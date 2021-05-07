import * as D from 'io-ts/Decoder';

import { pipe } from 'fp-ts/function';

const productNameDecoder = D.union(
  D.literal('toll'),
  D.literal('video'),
  D.literal('screen_sharing'),
  D.literal('toll_free'),
  D.literal('one_number'),
  D.literal('conference_greeting'),
  D.literal('conference_moh'),
  D.literal('keywords'),
  D.literal('extra_storage'),
  D.literal('basic_storage'),
  D.literal('broadcaster'),
  D.literal('premium_toll'),
  D.literal('pay_what_you_can'),
  D.literal('softphone'),
  D.literal('bundle')
);

export type ProductName = D.TypeOf<typeof productNameDecoder>;

const paymentTypeDecoder = D.union(
  D.literal('per-month-min-caller'),
  D.literal('per-min-caller'),
  D.literal('storage'),
  D.literal('mo'),
  D.literal('softphone'),
  D.literal('screen-sharing'),
  D.literal('bundle')
);

export type PaymentType = D.TypeOf<typeof paymentTypeDecoder>;

export const rateStatusDecoder = pipe(
  D.sum('status')({
    active: D.struct({
      status: D.literal('active'),
    }),
    inactive: D.struct({
      status: D.literal('inactive'),
    }),
    pending_cancel: D.struct({
      status: D.literal('pending_cancel'),
      expiry_date: D.number,
    }),
    pending_active: D.struct({
      status: D.literal('pending_active'),
      effective_date: D.number,
    }),
  }),

  D.map((res) => {
    return {
      status: {
        ...res,
      },
    };
  })
);

export type RateStatus = D.TypeOf<typeof rateStatusDecoder>;

const rateDecoder = pipe(
  D.struct({
    id: D.number,
    price: D.number,
    price_per_unit: D.number,
    product: productNameDecoder,
    title: D.string,
    rates: D.array(D.number),
  }),
  D.intersect(D.partial({ discount_group: D.string })),
  D.intersect(rateStatusDecoder)
);

export interface OneRateBrand {
  readonly OneRate: unique symbol;
}

export type OneRate = [number] & OneRateBrand;

export const oneRate: D.Decoder<unknown, OneRate> = pipe(
  D.array(D.number),
  D.refine(
    (rates): rates is OneRate => rates.length === 1 || rates.length === 0,
    'only one or zero rates'
  )
);

export const currentRatesDecoder = D.sum('multiple_rates_allowed')({
  true: D.struct({
    multiple_rates_allowed: D.literal(true),
    current_rates: D.array(D.number),
  }),
  false: D.struct({
    multiple_rates_allowed: D.literal(false),
    current_rates: oneRate,
  }),
});

const productDecoder = pipe(
  D.struct({
    id: productNameDecoder,
    title: D.string,
    enabled: D.boolean,
    rates: D.array(D.number),
  }),
  D.intersect(D.partial({ default_rate: D.nullable(D.number) })),
  D.intersect(D.partial({ payment_type: paymentTypeDecoder })),
  D.intersect(currentRatesDecoder)
);

export type ProductModel = D.TypeOf<typeof productDecoder>;

export const productsPayloadDecoder = D.struct({
  products: D.array(productDecoder),
  rates: D.array(rateDecoder),
});

export type ProductsPayload = D.TypeOf<typeof productsPayloadDecoder>;

export type RateModel = D.TypeOf<typeof rateDecoder>;

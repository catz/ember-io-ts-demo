import DS from 'ember-data';
import { PaymentType, ProductModel } from 'ember-io-ts-demo/codecs/product';
import Rate from './rate';
const { Model, attr, hasMany } = DS;

export default class Product extends Model /*implements ProductModel*/ {
  @attr title!: ProductModel['title'];
  @attr payment_type!: PaymentType;

  @attr enabled!: ProductModel['enabled'];
  @hasMany('rate', { async: false }) rates!: DS.PromiseManyArray<Rate>;
  @hasMany('rate', { async: false }) current_rates!: DS.PromiseManyArray<Rate>;
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    product: Product;
  }
}

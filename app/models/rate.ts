import DS from 'ember-data';
import { RateModel, RateStatus } from 'ember-io-ts-demo/codecs/product';
import { assertExhaustive } from 'ember-io-ts-demo/utils/utils';
const { Model, attr } = DS;

export default class Rate extends Model /*implements RateModel*/ {
  @attr title!: RateModel['title'];
  @attr status!: RateStatus['status'];
  @attr payment_type!: Rate;
  @attr price!: RateModel['price'];
  @attr price_pre_unit!: RateModel['price_per_unit'];

  get displayStatus(): string {
    switch (this.status.status) {
      case 'active':
        return 'Active';
      case 'inactive':
        return 'Inactive';
      case 'pending_active':
        return `Active since: ${new Date(this.status.effective_date * 1000)}`;
      case 'pending_cancel':
        return `Available until: ${new Date(this.status.expiry_date * 1000)}`;
      default:
        assertExhaustive(this.status, 'Incorrect status value');
    }
  }
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    rate: Rate;
  }
}

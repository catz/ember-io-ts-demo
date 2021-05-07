import DS from 'ember-data';
import { UserModel } from 'ember-io-ts-demo/codecs/user';
const { Model, attr } = DS;

export default class User extends Model implements UserModel {
  @attr()
  name!: UserModel['name'];

  @attr()
  age!: UserModel['age'];

  @attr()
  admin!: UserModel['admin'];

  @attr()
  email?: UserModel['email'];
}

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    user: User;
  }
}

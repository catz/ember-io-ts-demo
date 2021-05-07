import Route from '@ember/routing/route';
import DS from 'ember-data';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import RSVP from 'rsvp';

export default class Profile extends Route {
  @service store!: DS.Store;
  model() {
    return RSVP.hash({
      users: this.store.findAll('user'),
      products: this.store.findAll('product'),
    });
  }

  @action
  error(error, transition) {
    return true;
  }
}

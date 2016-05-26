/**
 * Index Route.
 *
 * @module routes/index
 */
import Ember from 'ember';

/**
 * Exports extension of Ember's Route class.
 */
export default Ember.Route.extend({
  /**
   * The model for the route. The function queries for
   * *all* `system-trend` records.
   */
  model() {
    return this.store.findAll('system-trend');
  }
});

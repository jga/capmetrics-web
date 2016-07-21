/**
 * Main application Route.
 *
 * @module routes/application
 */
import Ember from 'ember';

/**
 * Exports extension of Ember's Route class.
 */
export default Ember.Route.extend({
  /**
   * The model for the route. The function queries for
   * *all* `system-trend` records and *all* `route-label` records.
   *
   * @returns {Object} An Ember.RSVP.hash keyed to `routeLabel` and `trends`.
   */
  model() {
    return Ember.RSVP.hash({
      routeLabels: this.store.findAll('route-label'),
      trends: this.store.findAll('system-trend'),
    });
  }
});

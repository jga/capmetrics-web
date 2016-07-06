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
   * *all* `system-trend` records and *all* `route-label` models.
   */
  model() {
    return Ember.RSVP.hash({
      routeLabels: this.store.findAll('route-label'),
      trends: this.store.findAll('system-trend'),
    });
  }
});

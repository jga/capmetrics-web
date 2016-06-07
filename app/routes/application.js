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
   * *all* `system-trend` records and high ridership `daily-ridership` models.
   */
  model() {
    return Ember.RSVP.hash({
      services: this.store.findAll('route'),
      trends: this.store.findAll('system-trend'),
      dailyRiderships: this.store.findAll('daily-ridership')
    });
  }
});

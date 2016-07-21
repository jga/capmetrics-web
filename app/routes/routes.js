/**
 * Provides model and state for transit `route` collection requests .
 *
 * @module routes/routes
 */
import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      window.scrollTo(0,0);
    }
  },

  activate: function() {
    this._super();
    window.scrollTo(0,0);
  },

  /**
   * The model peeks all `route-label` models; getting the collection of all proper `route` models
   * would take significant time and is not presently required by the functionality exposed by the
   * web application.
   *
   * @returns {Object} An Ember.RSVP.hash keyed to `routeLabels`.
   */
  model() {
    return Ember.RSVP.hash({
      routeLabels: this.store.peekAll('route-label')
    });
  }
});

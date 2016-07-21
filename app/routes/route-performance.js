/**
 * Route for `route-performance` requests.
 *
 * @module routes/route-performance
 */
import Ember from 'ember';

export default Ember.Route.extend({
  /** The `didTransition` action requires a scroll to the top after a transition. **/
  actions: {
    didTransition: function() {
      window.scrollTo(0,0);
    }
  },

  /** Empties out nvd3.js globals on activation **/
  activate: function() {
    this._super();
    nv.charts = {};
    nv.graphs = [];
    nv.logs = {};
    // and remove listeners for onresize.
    window.onresize = null;
    window.scrollTo(0,0);
  },

  /**
   * The model for the route. The function queries for the `route` record with the route number
   * parameter identified in the URL route request. It also peeks for all `route-label` records.
   *
   * @returns {Object} An Ember.RSVP.hash keyed to `routeLabels` and `route`.
   */
  model(params) {
    return Ember.RSVP.hash({
      route: this.store.queryRecord('route', {filter: {'route-number': params.route_number}}),
      routeLabels: this.store.peekAll('route-label')
    });
  }
});

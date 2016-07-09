/**
 * Index Route.
 *
 * @module routes/index
 */
import Ember from 'ember';
import ENV from 'capmetrics-web/config/environment';

let topRouteHandler = function() {
  let ajaxSettings = {
    url: ENV.APP.API_HOST + '/high-ridership',
  }
  return Ember.$.ajax(ajaxSettings).done(function(data) {
    return data;
  })
}

/**
 * Exports extension of Ember's Route class.
 */
export default Ember.Route.extend({
  activate: function() {
    this._super();
    nv.charts = {};
    nv.graphs = [];
    nv.logs = {};
    // and remove listeners for onresize.
    window.onresize = null;
  },
  /**
   * The model for the route. The function queries for
   * *all* `system-trend` records and high ridership `daily-ridership` models.
   */
  model() {
    return Ember.RSVP.hash({
      routeLabels: this.store.peekAll('route-label'),
      trends: this.store.peekAll('system-trend'),
      topRoutes: topRouteHandler()
    });
  }
});

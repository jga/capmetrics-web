/**
 * Route for the `system` page.
 *
 * @module routes/system
 */
import Ember from 'ember';
import ENV from 'capmetrics-web/config/environment';

/**
 * A **private** module function.
 *
 * Sends an AJAX request to the `daily-riderships` endpoint.
 *
 * Returns a jQuery AJAX promise that itself returns an array of route compendium data.
 *
 * @member {Function}
 */
let getCompendiums = function() {
  let ajaxSettings = {
    url: ENV.APP.API_HOST + '/daily-riderships',
    data: {sparkline: true}
  }
  return Ember.$.ajax(ajaxSettings).done(function(data) {
    return data;
  })
}

/**
 * Exports extension of Ember's Route class.
 */
export default Ember.Route.extend({
  /**
   * Peeks *all* `system-trend` records, and issues an AJAX call for
   * route compendiums with daily ridership data by service type.
   *
   * @returns {Object} An Ember.RSVP.hash keyed to `systemTrends` and `compendiums`.
   */
  model() {
    return Ember.RSVP.hash({
      systemTrends: this.store.peekAll('system-trend'),
      compendiums: getCompendiums()
    })
  }
});

/**
 * Route for the `productivity` page.
 *
 * @module routes/productivity
 */
import Ember from 'ember';
import ENV from 'capmetrics-web/config/environment';

/**
 * A **private** module function.
 *
 * Sends an AJAX request to the `productivity` endpoint.
 *
 * Returns a jQuery AJAX promise that itself returns an array of
 *
 * @member {Function}
 *  period (season and year) performance data.
 */
let productivityHandler = function() {
  let ajaxSettings = {
    url: ENV.APP.API_HOST + '/productivity',
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
   * The model for the route. The function sends an AJAX call that returns a
   * JSON object containing an array of period (season and year) performance data.
   */
  model() {
    return productivityHandler();
  }
});

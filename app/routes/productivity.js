/**
 * Productivity Route.
 *
 * @module routes/productivity
 */
import Ember from 'ember';
import ENV from 'capmetrics-web/config/environment';

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

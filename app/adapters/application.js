/**
 * @module adapters/application
 */
import JSONAPIAdapter from 'ember-data/adapters/json-api';
import ENV from 'capmetrics-web/config/environment';

/** Exports extension of `JSONAPIAdapter`. */
export default JSONAPIAdapter.extend({
  /**
   * Sets adapter's API host to that set in the ENV.APP.API_HOST setting.
   */
  host: ENV.APP.API_HOST
});

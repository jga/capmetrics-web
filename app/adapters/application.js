import JSONAPIAdapter from 'ember-data/adapters/json-api';
import ENV from 'capmetrics-web/config/environment';

export default JSONAPIAdapter.extend({
  host: ENV.APP.API_HOST
});

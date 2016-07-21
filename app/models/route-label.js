/** @module models/route-label */
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

/**
 * Exports an extension of the Ember Data `Model` class.
 *
 * ##### Model Fields
 *
 * | Field                      | Type                |
 * |----------------------------|---------------------|
 * | `routeNumber`              | Number              |
 * | `routeName`                | String              |
 */
export default Model.extend({
  routeNumber: attr('number'),
  routeName: attr('string')
});

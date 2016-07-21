/**
 * @module models/system-trend
 */
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

/**
 * Exports an exension of the Ember Data `Model` class.
 *
 * Provides convenient trend data for a *type* of transit service.
 *
 * ### **Model Fields**
 *
 * | Field        | Type       |
 * |--------------|------------|
 * | `updatedOn`  | Date       |
 * | `serviceType`| String     |
 * | `trend`      | JSON       |
 *
 */
export default Model.extend({
    /** When the model was last updated.
     *
     * @type {Date}
     */
    updatedOn: attr('date'),
    /** JSON with trend data for a service type.
     *
     * @type {JSON}
     */
    trend: attr(),
    /**
     * A description of the type of transit service (e.g. 'Bus' or 'Rail').
     *
     * @type {String}
     */
    serviceType: attr('string')
});

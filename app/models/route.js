/** @module models/route */
import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

/**
 * Exports an extension of the Ember Data `Model` class.
 *
 * ##### Model Fields
 *
 * | Field                      | Type                    |
 * |----------------------------|-------------------------|
 * | `routeNumber`              | Number                  |
 * | `routeName`                | String                  |
 * | `serviceType`              | String                  |
 * | `isHighRidership`          | Boolean                 |
 * | `dailyRiderships`          | hasMany('route')        |
 * | `serviceHourRiderships`    | hasMany('route')        |
 * | `isTopRoute`               | String *Ember.Computed* |
 */
export default Model.extend({
  routeNumber: attr('number'),
  routeName: attr('string'),
  serviceType: attr('string'),
  isHighRidership: attr('boolean'),
  dailyRiderships: hasMany('daily-ridership'),
  serviceHourRiderships: hasMany('service-hour-ridership'),

  isTopRoute: Ember.computed('isHighRidership', function() {
    if (this.get('isHighRidership')){
      return 'Yes'
    } else {
      return 'No'
    }
  })
});

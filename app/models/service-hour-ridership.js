/** @module models/service-hour-ridership */
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

/**
 * Exports an extension of the Ember Data `Model` class.
 *
 * ##### Model Fields
 *
 * | Field                      | Type                |
 * |----------------------------|---------------------|
 * | `calendarYear`             | Number              |
 * | `createdOn`                | Date                |
 * | `dayOfWeek`                | String              |
 * | `isCurrent`                | Boolean             |
 * | `measurementTimestamp`     | Date                |
 * | `ridership`                | Number              |
 * | `route`                    | belongsTo('route')  |
 * | `season`                   | String              |
 */
export default Model.extend({
  calendarYear: attr('number'),
  createdOn: attr('date'),
  dayOfWeek: attr('string'),
  isCurrent: attr('boolean'),
  measurementTimestamp: attr('date'),
  ridership: attr('number'),
  route: belongsTo('route'),
  season: attr('string')
});

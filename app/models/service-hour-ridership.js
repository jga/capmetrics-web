import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

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

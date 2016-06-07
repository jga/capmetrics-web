import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  routeNumber: attr('number'),
  routeName: attr('string'),
  serviceType: attr('string'),
  isHighRidership: attr('boolean'),
  dailyRiderships: hasMany('daily-ridership'),

  isTopRoute: Ember.computed('isHighRidership', function() {
    if (this.get('isHighRidership')){
      return 'Yes'
    } else {
      return 'No'
    }
  })
});

import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  routeNumber: attr('number'),
  routeName: attr('string'),
});

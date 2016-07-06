import Ember from 'ember';

export default Ember.Component.extend({

  services: Ember.computed('labels', function(){
    return this.get('labels').toArray().sort(function(a, b) {
      if (parseInt(a.get('routeNumber')) > parseInt(b.get('routeNumber'))) { return 1 }
      if (parseInt(a.get('routeNumber')) < parseInt(b.get('routeNumber'))) { return -1 }
      return 0;
    });
  })
});

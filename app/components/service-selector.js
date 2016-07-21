/** @module components/service-selector */
import Ember from 'ember';

/**
 * Exports extension of `Ember.component`.
 */
export default Ember.Component.extend({

  /** Returns array of route label objects sorted by route number. */
  services: Ember.computed('labels', function(){
    if (this.get('labels')){
      return this.get('labels').toArray().sort(function(a, b) {
        if (parseInt(a.get('routeNumber')) > parseInt(b.get('routeNumber'))) { return 1 }
        if (parseInt(a.get('routeNumber')) < parseInt(b.get('routeNumber'))) { return -1 }
        return 0;
      });
    } else {
      return null;
    }
  })
});

import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      window.scrollTo(0,0);
    }
  },
  activate: function() {
    this._super();
    nv.charts = {};
    nv.graphs = [];
    nv.logs = {};
    // and remove listeers for onresize.
    window.onresize = null;
    window.scrollTo(0,0);
  },
  model(params) {
    return Ember.RSVP.hash({
      route: this.store.queryRecord('route', {filter: {'route-number': params.route_number}}),
      routeLabels: this.store.peekAll('route-label')
    });
  }
});

import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      window.scrollTo(0,0);
    }
  },
  activate: function() {
    this._super();
    window.scrollTo(0,0);
  },
  model() {
    return Ember.RSVP.hash({
      routes: this.store.findAll('route')
    });
  }
});

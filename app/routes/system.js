import Ember from 'ember';

let getCompendiums = function() {
  let ajaxSettings = {
    url: 'daily-riderships',
    data: {sparkline: true}
  }
  return Ember.$.ajax(ajaxSettings).done(function(data) {
    return data;
  })
}

export default Ember.Route.extend({
  model(){
    return Ember.RSVP.hash({
      systemTrends: this.store.peekAll('system-trend'),
      compendiums: getCompendiums()
    })
  }
});

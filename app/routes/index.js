/**
 * Index Route.
 *
 * @module routes/index
 */
import Ember from 'ember';

let topRoutesFromPromise = function(store) {
  return new Ember.RSVP.Promise(function(resolve) {
    var topTrends = Ember.A();
    store.query('daily-ridership', {'high-ridership': 'all'})
         .then(function(dailyRiderships) {
           if (!dailyRiderships.get('length') > 0) {
             console.log('Missing high ridership data')
           }
           for (let i = 0; i < dailyRiderships.get('length'); i++) {
             dailyRiderships.objectAt(i).get('route').then(function(route) {
               if (!route) {
                console.log('Missing route for daily-ridership: ' + dailyRidership.get('id'));
               }
               let routeNumber = route.get('routeNumber').toString();
               let routeCompendium = topTrends.findBy('routeNumber', routeNumber);
               if (routeCompendium) {
                 routeCompendium.riderships.pushObject(dailyRiderships.objectAt(i));
                 routeCompendium.riderships = routeCompendium.riderships.sortBy('measurementTimestamp');
               } else {
                 let riderships = Ember.A();
                 riderships.pushObject(dailyRiderships.objectAt(i));
                 let selector = 'top-route-viz-' + routeNumber;
                 let routeCompendium = {
                   'routeNumber': routeNumber,
                   'routeName': route.get('routeName'),
                   'selector': selector,
                   'riderships': riderships
                 }
                 topTrends.pushObject(routeCompendium);
               }
             });
           }
         })
         .finally(function() {
           resolve(topTrends);
         });
  });
}

let topRouteHandler = function() {
  return Ember.$.ajax('high-ridership').done(function(data) {
    return data;
  })
}



/**
 * Exports extension of Ember's Route class.
 */
export default Ember.Route.extend({
  activate: function(){
    this._super();
    nv.charts = {};
    nv.graphs = [];
    nv.logs = {};
    // and remove listeers for onresize.
    window.onresize = null;
  },
  /**
   * The model for the route. The function queries for
   * *all* `system-trend` records and high ridership `daily-ridership` models.
   */
  model() {
    return Ember.RSVP.hash({
      routeLabels: this.store.peekAll('route-label'),
      trends: this.store.peekAll('system-trend'),
      topRoutes: topRouteHandler()
    });
  }
});

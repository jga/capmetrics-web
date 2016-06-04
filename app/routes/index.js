/**
 * Index Route.
 *
 * @module routes/index
 */
import Ember from 'ember';

let topRouteHandler = function(store) {
  return new Ember.RSVP.Promise(function(resolve) {
    var topTrends = Ember.A();
    store.query('daily-ridership', {'high-ridership': 'all'})
         .then(function(dailyRiderships) {
           dailyRiderships.forEach(function(dailyRidership) {
             dailyRidership.get('route').then(function(route) {
               let routeNumber = route.get('routeNumber').toString();
               let routeCompendium = topTrends.findBy('routeNumber', routeNumber);
               if (routeCompendium) {
                 routeCompendium.riderships.pushObject(dailyRidership);
                 routeCompendium.riderships = routeCompendium.riderships.sortBy('measurementTimestamp');
               } else {
                 let riderships = Ember.A();
                 riderships.pushObject(dailyRidership);
                 let selector = 'top-route-viz-' + routeNumber;
                 let routeCompendium = {
                   'routeNumber': routeNumber,
                   'routeName': route.get('routeName'),
                   'selector': selector,
                   'riderships': riderships
                 }
                 topTrends.pushObject(routeCompendium);
               }});});})
         .finally(function() {
           resolve(topTrends);
         });
  })
}

/**
 * Exports extension of Ember's Route class.
 */
export default Ember.Route.extend({
  /**
   * The model for the route. The function queries for
   * *all* `system-trend` records and high ridership `daily-ridership` models.
   */
  model() {
    return Ember.RSVP.hash({
      trends: this.store.findAll('system-trend'),
      topRoutes: topRouteHandler(this.store)
    });
  }
});

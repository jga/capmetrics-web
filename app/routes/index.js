/**
 * Index Route.
 *
 * @module routes/index
 */
import Ember from 'ember';
import ENV from 'capmetrics-web/config/environment';

let topRouteHandler = function() {
  let ajaxSettings = {
    url: ENV.APP.API_HOST + '/high-ridership',
  }
  return Ember.$.ajax(ajaxSettings).done(function(routeCompendiums) {
      // sort descending by latest weekday ridership - highest weekday ridership
      // route will be at the start of array
      routeCompendiums.sort(function(a, b) {
        //get last season and calendar year - capmetrics ETL places most recent timestamps at end of array
        var mostRecentYear = a.riderships[a.riderships.length - 1].calendarYear;
        var mostRecentSeason = a.riderships[a.riderships.length - 1].season;
        //get 'weekday' with last timestamp
        let ridershipA = _.find(a.riderships, function(ridership) {
          return (ridership.calendarYear === mostRecentYear
                  && ridership.season === mostRecentSeason
                  && ridership.dayOfWeek === 'weekday')
        })
        let ridershipB = _.find(b.riderships, function(ridership) {
          return (ridership.calendarYear === mostRecentYear
                  && ridership.season === mostRecentSeason
                  && ridership.dayOfWeek === 'weekday')
        })
        if (ridershipA) {
          if (ridershipA.ridership > ridershipB.ridership) {
            return -1;
          }
          if (ridershipA.ridership < ridershipB.ridership) {
            return 1;
          }
          return 0;
        } else {
          console.log('An expected "weekday" DailyRidership model was NOT found for the top routes.')
          return 1;
        }
      })
      return routeCompendiums;
  })
}

/**
 * Exports extension of Ember's Route class.
 */
export default Ember.Route.extend({
  activate: function() {
    this._super();
    nv.charts = {};
    nv.graphs = [];
    nv.logs = {};
    // and remove listeners for onresize.
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

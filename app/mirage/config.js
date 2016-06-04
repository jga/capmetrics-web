import * as routeHandlers from './route-handlers/index';

export default function() {
  this.get('routes/:route_id', routeHandlers.getRoute);
  this.get('system-trends', routeHandlers.getSystemTrends);
  this.get('daily-riderships', routeHandlers.getDailyRiderships);
}

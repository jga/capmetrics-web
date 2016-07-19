import * as routeHandlers from './route-handlers/index';

export default function() {
  this.get('daily-riderships', routeHandlers.getDailyRiderships);
  this.get('high-ridership', routeHandlers.getHighRidership);
  this.get('productivity', routeHandlers.getProductivity);
  this.get('routes', routeHandlers.getRoutes);
  this.get('routes/:route_id', routeHandlers.getRoute);
  this.get('route-labels', routeHandlers.getRouteLabels);
  this.get('service-hour-riderships', routeHandlers.getServiceHourRiderships);
  this.get('system-trends', routeHandlers.getSystemTrends);
}

import * as routeHandlers from './route-handlers/index';

export default function() {
  this.get('system-trends', routeHandlers.getSystemTrends);
}

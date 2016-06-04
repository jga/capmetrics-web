
export default function getRoute(db, request) {
  let responseData = null;
  let routeId = request.params.route_id;
  let model = db.routes.find(routeId)
  if (model) {
    let resourceObject = { 'id': model.id, 'type': 'routes' };
    let attributes = {
      'route-number': model['route-number'],
      'route-name': model['route-name'],
      'service-type': model['service-type'],
      'is-high-ridership': model['is-high-ridership'],
    }
    resourceObject['attributes'] = attributes;
    let dailyRidershipsData = [];
    for (let i = 0; i < model['daily-riderships'].length; i++) {
      dailyRidershipsData.push({'type': 'daily-riderships', 'id': model['daily-riderships'][i]});
    }
    resourceObject['relationships'] = {
      'daily-riderships': {
        'data': dailyRidershipsData
      }
    }
    responseData = resourceObject;
  }
  return {
    'data': responseData
  }
};

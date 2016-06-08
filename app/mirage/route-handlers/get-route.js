import serializeDailyRidership from 'capmetrics-web/mirage/serializers/daily-ridership';
import serializeServiceHourRidership from 'capmetrics-web/mirage/serializers/service-hour-ridership';

export default function getModel(db, request) {
  var response = {meta: {}};
  let routeId = request.params.route_id;
  var model = db.routes.find(routeId);
  if (model) {
    let included = [];
    let resourceObject = { 'id': model.id, 'type': 'routes' };
    let attributes = {
      'route-number': model['route-number'],
      'route-name': model['route-name'],
      'service-type': model['service-type'],
      'is-high-ridership': model['is-high-ridership'],
    }
    resourceObject['attributes'] = attributes;
    included = [];
    let dailyRidershipsData = [];
    let riderships = model['daily-riderships'];
    for (let i = 0; i < riderships.length; i++) {
      let id = riderships[i]
      dailyRidershipsData.push({'type': 'daily-riderships', 'id': id});
      let relationshipModel = db['daily-riderships'].find(id);
      let resourceObject = serializeDailyRidership(relationshipModel);
      included.push(resourceObject);
    }
    let serviceHourRidershipsData = [];
    for (let i = 0; i < model['service-hour-riderships'].length; i++) {
      let id = model['service-hour-riderships'][i];
      serviceHourRidershipsData.push({'type': 'service-hour-riderships', 'id': id});
      let relationshipModel = db['service-hour-riderships'].find(id);
      let resourceObject = serializeServiceHourRidership(relationshipModel);
      included.push(resourceObject);
    }
    resourceObject['relationships'] = {
      'daily-riderships': {
        'data': dailyRidershipsData
      },
      'service-hour-riderships': {
        'data': serviceHourRidershipsData
      }
    }
    response['data'] = resourceObject;
    response['included'] =  included;
  }
  return response;
}

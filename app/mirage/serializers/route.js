export default function(model) {
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
  let serviceHourRidershipsData = [];
  for (let i = 0; i < model['service-hour-riderships'].length; i++) {
    serviceHourRidershipsData.push({'type': 'service-hour-riderships', 'id': model['service-hour-riderships'][i]});
  }
  resourceObject['relationships'] = {
    'daily-riderships': {
      'data': dailyRidershipsData
    },
    'service-hour-riderships': {
      'data': serviceHourRidershipsData
    }
  }
  return resourceObject;
}

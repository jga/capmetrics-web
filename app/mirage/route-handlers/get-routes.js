var toResourceObject = function(model){
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
  return resourceObject;
}

var assemblePrimaryData = function(models){
  let responseCollection = [];
  for (let i = 0; i < models.length; i++) {
    let model = models[i];
    let resourceObject = toResourceObject(model);
    responseCollection.push(resourceObject);
  }
  return {
    'data': responseCollection
  };
}

export default function getResourceCollection(db, request) {
  var routes;
  if (request.queryParams.hasOwnProperty('filter[route-number]')) {
    routes = db.routes.where({'route-number': request.queryParams['filter[route-number]']});
    if (routes.length > 0){
      return {'data': toResourceObject(routes[0])}
    } else {
      return {'data': null}
    }
  } else {
    routes = db['routes'];
    return assemblePrimaryData(routes);
  }
}


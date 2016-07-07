import serializeRoute from 'capmetrics-web/mirage/serializers/route';
import serializeDailyRidership from 'capmetrics-web/mirage/serializers/daily-ridership';
import serializeServiceHourRidership from 'capmetrics-web/mirage/serializers/service-hour-ridership';
import IncludedHelper from 'capmetrics-web/mirage/utils/included';

var assemblePrimaryData = function(models, db){
  let responseCollection = [];
  let included = new IncludedHelper();
  for (let i = 0; i < models.length; i++) {
    let model = models[i];
    let resourceObject = serializeRoute(model);
    let relationships = resourceObject.relationships;
    let dailyIdentifiers = relationships['daily-riderships']['data'];
    for (let j = 0; j < dailyIdentifiers.length; j++) {
      let resourceIdentifier = dailyIdentifiers[j];
      let dr =  db['daily-riderships'].find(resourceIdentifier.id);
      included.addResourceObject(serializeDailyRidership(dr));
    }
    let hourIdentifiers = relationships['service-hour-riderships']['data'];
    for (let k = 0; k < hourIdentifiers.length; k++) {
      let resourceIdentifier = hourIdentifiers[k]
      let shr =  db['service-hour-riderships'].find(resourceIdentifier.id);
      included.addResourceObject(serializeServiceHourRidership(shr));
    }
    responseCollection.push(resourceObject);
  }
  return {
    'data': responseCollection,
    'included': included.getIncluded()
  };
}

var buildIncluded = function(primaryData, db) {
  let included = [];
  let dailyRidershipsData = [];
  let riderships = primaryData['relationships']['daily-riderships']['data'];
  for (let i = 0; i < riderships.length; i++) {
    let id = riderships[i].id;
    dailyRidershipsData.push({'type': 'daily-riderships', 'id': id});
    let relationshipModel = db['daily-riderships'].find(id);
    let resourceObject = serializeDailyRidership(relationshipModel);
    included.push(resourceObject);
  }
  let serviceHourRidershipsData = [];
  let hourlies = primaryData['relationships']['service-hour-riderships']['data'];
  for (let j = 0; j < hourlies.length; j++) {
    let id = hourlies[j].id;
    serviceHourRidershipsData.push({'type': 'service-hour-riderships', 'id': id});
    let relationshipModel = db['service-hour-riderships'].find(id);
    let resourceObject = serializeServiceHourRidership(relationshipModel);
    included.push(resourceObject);
  }
  return included;
}

export default function(db, request) {
  var routes;
  if (request.queryParams.hasOwnProperty('filter[route-number]')) {
    routes = db.routes.where({'route-number': request.queryParams['filter[route-number]']});
    if (routes.length > 0) {
      let primaryData = serializeRoute(routes[0]);
      let included = buildIncluded(primaryData, db);
      return {'data': primaryData, 'included': included}
    } else {
      return {'data': null}
    }
  } else {
    routes = db['routes'];
    return assemblePrimaryData(routes, db);
  }
}

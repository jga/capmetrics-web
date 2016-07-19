import serializeRouteLabel from 'capmetrics-web/mirage/serializers/route-label';

var assemblePrimaryData = function(models){
  let responseCollection = [];
  for (let i = 0; i < models.length; i++) {
    let model = models[i];
    let resourceObject = serializeRouteLabel(model);
    responseCollection.push(resourceObject);
  }
  return {
    'data': responseCollection,
  };
}

export default function(db) {
  var routes = db['routes'];
  return assemblePrimaryData(routes);
}


let assembleAllModels = function(models){
  let responseCollection = [];
  for (let i = 0; i < models.length; i++) {
    let model = models[i];
    let resourceObject = { 'id': model.id, 'type': 'daily-riderships' };
    let attributes = {
      'calendar-year': model['calendar-year'],
      'created-on': model['created-on'],
      'day-of-week': model['day-of-week'],
      'is-current': model['is-current'],
      'measurement-timestamp': model['measurement-timestamp'],
      'ridership': model['ridership'],
      'season': model['season']
    }
    resourceObject['attributes'] = attributes;
    resourceObject['relationships'] = {
      'route': {
        'data': {
          'type': 'routes', 'id': model['route-id']
        }
      }
    }
    responseCollection.push(resourceObject);
  }
  return {
    'data': responseCollection
  };
}

let assembleHighRidership = function(){
  return assembleAllModels();
}

export default function getDailyRiderships(db, request) {
  if (request.queryParams.hasOwnProperty('high-ridership')) {
    let models = db['daily-riderships'];
    return assembleAllModels(models);
  }
  else {
    let models = db['daily-riderships'];
    return assembleAllModels(models);
  }
}


export default function getDailyRiderships(db, request) {
  if (request.queryParams.hasOwnProperty('high-ridership')) {
    let allModels = db['daily-riderships'];
    let responseCollection = [];
    for (let i = 0; i < allModels.length; i++) {
      let model = allModels[i];
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
  else {
    return {'data': []}
  }
}


export default function(model) {
  let resourceObject = { 'id': model.id, 'type': 'service-hour-riderships' };
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
  return resourceObject;
}

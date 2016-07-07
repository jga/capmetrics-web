export default function(model) {
  let resourceObject = { 'id': model.id.toString(), 'type': 'route-labels' };
  let attributes = {
    'route-number': model['route-number'],
    'route-name': model['route-name'],
  }
  resourceObject['attributes'] = attributes;
  return resourceObject;
}

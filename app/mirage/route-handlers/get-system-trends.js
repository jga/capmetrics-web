
export default function (db) {
  let allModels = db['system-trends'];
  let responseCollection = [];
  for (let i = 0; i < allModels.length; i++) {
    let model = allModels[i];
    let resourceObject = { 'id': model.id, 'type': 'system-trends' };
    let attributes = {
      'updated-on': model['updated-on'],
      'trend': model.trend,
      'service-type': model['service-type']
    }
    resourceObject['attributes'] = attributes;
    responseCollection.push(resourceObject);
  }
  return {
    'data': responseCollection
  };
}


import serializeDailyRidership from 'capmetrics-web/mirage/serializers/daily-ridership';
import SparklineData from '../fixtures/sparkline-riderships';

let assembleAllModels = function(models){
  let responseCollection = [];
  for (let i = 0; i < models.length; i++) {
    let model = models[i];
    let resourceObject = serializeDailyRidership(model);
    responseCollection.push(resourceObject);
  }
  return {
    'data': responseCollection
  };
}

let assembleHighRidership = function(models){
  return assembleAllModels(models);
}

export default function getDailyRiderships(db, request) {
  if (request.queryParams.hasOwnProperty('high-ridership')) {
    let models = db['daily-riderships'];
    return assembleHighRidership(models);
  } else if (request.queryParams.hasOwnProperty('sparkline')) {
    return SparklineData;
  } else {
    let models = db['daily-riderships'];
    return assembleAllModels(models);
  }
}


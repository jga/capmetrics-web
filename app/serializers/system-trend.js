/** @module serializers/system-trend */
import JSONAPISerializer from 'ember-data/serializers/json-api';

/** Exports extension of `JSONAPISerializer` */
export default JSONAPISerializer.extend({
  /** Transforms ridership floats from API into integers */
  normalize(modelClass, resourceHash) {
    let originalTrend = JSON.parse(resourceHash.attributes.trend);
    let cleanTrend = []
    for (let i = 0; i < originalTrend.length; i++) {
      // each original 'pair' is an iso datetime string 'paired' with a ridership float
      let originalPair = originalTrend[i];
      let ridership = Math.round(originalPair[1]);
      let cleanPair = [originalPair[0], ridership];
      cleanTrend.push(cleanPair);
    }
    resourceHash.attributes.trend = cleanTrend;
    return this._super(...arguments);
  },
});

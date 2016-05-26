/**
 * Fills empty points in data set to ensure working NVD3 charts
 *
 * @module utils/fill-empty-points
 */

let createTimestampInventory = function(datum) {
  let inventory = new Set();
  for (let i = 0; i < datum.get('length'); i++) {
    let data = datum[i];
    for (let j = 0; j < data.values.length; j++) {
      let dataPairing = data.values[j];
      //First value is an ISO 8601 timestamp
      inventory.add(dataPairing[0])
    }
  }
  return inventory;
}

let repairSeries = function(data, timestampInventory) {
  let currentTimestamps = new Set();
  for (let i = 0; i < data.values.length; i++) {
    let dataPairing = data.values[i];
    //First value is an ISO 8601 timestamp
    currentTimestamps.add(dataPairing[0]);
  }
  let difference = new Set();
  timestampInventory.forEach(function(t) {
    if (!currentTimestamps.has(t)) {
      difference.add(t);
    }
  });
  for (let missing of difference) {
    data.values.push([missing, 0]);
  }
  data.values.sort(function(a, b) {
    return Date.parse(a[0]) - Date.parse(b[0]);
  })
  return data;
}

/**
 * Exports a function.  The expected paramater is an array with NVD3-friendly
 * data objects; specifically, they have `key` and `values` properties.
 *
 * @param {Array} datum NVD3-frendly data objects.
 */
export default function(datum) {
  let repairedDatum = []
  let inventory = createTimestampInventory(datum);
  for (let i = 0; i < datum.get('length'); i++) {
    let data = datum[i];
    repairedDatum.push(repairSeries(data, inventory));
  }
  return repairedDatum;
}

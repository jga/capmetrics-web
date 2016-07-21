/** @module components/route-trends */
import Ember from 'ember';
import fillEmptyPoints from 'capmetrics-web/utils/fill-empty-points';

let convertTimeStamps = function(d){
  let result = Date.parse(d[0]);
  return result;
}

let configureChart = function(chart) {
  // set mobile-first defaults
  let chartHeight = 250;
  let marginTop = 10;
  let marginBottom = 10;
  let marginLeft = 50;
  let marginRight = 50;
  let showControls = false;
  let showLegend = false;
  // adjust settings based on window size
  let size = nv.utils.windowSize();
  if (size.width >= 768) {
    chartHeight = 350;
    marginBottom = 50;
    showControls = true;
    showLegend = true;
  }
  // set initial render chart design
  chart.margin({
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft
  });
  chart.height(chartHeight);
  chart.showControls(showControls);
  chart.showLegend(showLegend);
  return chart;
}

let getContainerHeight = function() {
  let size = nv.utils.windowSize();
  if (size.width >= 768) {
    return 400
  } else {
    return 300;
  }
}

let createGraphLoader = function(selector, data, chart) {

  chart = configureChart(chart);
  let svgContainerHeight = getContainerHeight();
  return function loader() {
    try {
      d3.select(selector).append('svg')
        .datum(data)
        .transition().duration(500)
        .call(chart)
        .style({'height': svgContainerHeight + 'px'});
      let manager = nv.utils.windowResize(function() {
        chart = configureChart(chart);
        chart.update();
        let svgContainerHeight = getContainerHeight();
        d3.select(selector + ' .nvd3-svg')
          .style({'height': svgContainerHeight + 'px'});
      });
      chart.clear = manager.clear;
      return chart;
    } catch (e) {
      if (e instanceof TypeError) {
        console.log('TypeError for ' + selector);
      } else {
        console.log('Error for ' + selector);
      }
      console.log(e);
      console.log('route-trend error datum: \n' + JSON.stringify(data))
    }
  }
}

let loadChart = function(selector, data) {
  let chart = nv.models
                .stackedAreaChart()
                .useInteractiveGuideline(true)
                .x(convertTimeStamps)
                .y(function(d) {return parseInt(d[1]) })
                .controlLabels({stacked: "Stacked"})
                .duration(300);
  chart.xAxis.tickFormat(function(d) {return d3.time.format('%x')(new Date(d)) });
  chart.yAxis.tickFormat(d3.format(','));
  nv.addGraph(createGraphLoader(('#' + selector), data, chart));
  return chart;
}

let colorizeTrends = function(prettyData) {
  for (let i = 0; i < prettyData.length; i++) {
    let trend = prettyData[i];
    let color = '#05487F';
    if (trend.key === 'saturday') {
      color = '#29B86F';
    } else if (trend.key === 'sunday') {
      color = '#BDBADF';
    }
    trend.color = color;
  }
  return prettyData;
}

let toMondayTimestamp = function(timestamp, dayOfWeek) {
  // A monday timestamp helps align the x coordinate in the visualization
  // across the days of the week
  var candidateDate = new Date(timestamp);
  if (dayOfWeek === 'saturday') {
    candidateDate.setDate(candidateDate.getDate() - 5);
  } else if (dayOfWeek === 'sunday') {
    candidateDate.setDate(candidateDate.getDate() - 6);
  }
  return candidateDate.toISOString();
}

let prettifyProductivity = function(riderships) {
  let prettyData = Ember.A();
  riderships.forEach(function(ridership) {
    var dayOfWeek = ridership.get('dayOfWeek');
    let ridershipTrend = prettyData.findBy('key', dayOfWeek);
    if (ridershipTrend) {
      let mondayTimestamp = toMondayTimestamp(ridership.get('measurementTimestamp'), dayOfWeek);
      let adjustedProductivity = Math.round(ridership.get('ridership'));
      ridershipTrend['values'].pushObject([mondayTimestamp, adjustedProductivity])
    } else {
      let starterValues = Ember.A()
      let mondayTimestamp = toMondayTimestamp(ridership.get('measurementTimestamp'), dayOfWeek);
      starterValues.pushObject([
        mondayTimestamp,
        Math.round(ridership.get('ridership'))
      ]);
      let ridershipTrend = {
        'key': dayOfWeek,
        'values': starterValues
      }
      prettyData.pushObject(ridershipTrend);
    }
  })
  prettyData.sort(function(a, b) {
    if (a.key === 'weekday') { return -1 }
    if (a.key === 'saturday' && b.key === 'sunday') { return -1 }
    if (a.key === 'saturday' && b.key === 'weekday') { return 1 }
    if (a.key === 'sunday') { return 1 }
    return 0;
  });
  prettyData = colorizeTrends(prettyData);
  let filled = fillEmptyPoints(prettyData);
  return filled;
}

let prettifyRiderships = function(riderships) {
  let prettyData = Ember.A();
  riderships.forEach(function(ridership) {
    let dayOfWeek = ridership.get('dayOfWeek');
    let roundedRidership = Math.round(ridership.get('ridership'));
    let adjustedCount = dayOfWeek === 'weekday' ? roundedRidership * 5 : roundedRidership;
    let ridershipTrend = prettyData.findBy('key', dayOfWeek);
    if (ridershipTrend) {
      let mondayTimestamp = toMondayTimestamp(ridership.get('measurementTimestamp'), dayOfWeek);
      ridershipTrend['values'].pushObject([mondayTimestamp, adjustedCount])
    } else {
      let starterValues = Ember.A()
      let mondayTimestamp = toMondayTimestamp(ridership.get('measurementTimestamp'), dayOfWeek);
      starterValues.pushObject([mondayTimestamp, adjustedCount]);
      let ridershipTrend = {
        'key': dayOfWeek,
        'values': starterValues
      }
      prettyData.pushObject(ridershipTrend);
    }
  })
  prettyData.sort(function(a, b) {
    if (a.key === 'weekday') { return -1 }
    if (a.key === 'saturday' && b.key === 'sunday') { return -1 }
    if (a.key === 'saturday' && b.key === 'weekday') { return 1 }
    if (a.key === 'sunday') { return 1 }
    return 0;
  });
  prettyData = colorizeTrends(prettyData);
  let filled = fillEmptyPoints(prettyData);
  return filled;
}

let chartDailies = function(riderships) {
  riderships = riderships.sortBy('measurementTimestamp');
  let prettyData = prettifyRiderships(riderships);
  loadChart('daily-ridership-trend__viz', prettyData);
}

let chartHours = function(productivities) {
  productivities = productivities.sortBy('measurementTimestamp');
  let prettyProductivityData = prettifyProductivity(productivities);
  loadChart('service-hour-trend__viz', prettyProductivityData);
}

/**
 * Exports extension of `Ember.component`.
 *
 * The module has several **private** functions.
 *
 * ###### convertTimeStamps(d)
 *
 * Returns milliseconds from parsing date string at index zero for passed array.
 *
 * ###### configureChart(chart)
 *
 * Updates the settings of the passed `nvd3.js` chart. This is where window resizing update settings are for `route-trends` charts.
 *
 * Returns updated chart.
 *
 * ###### getContainerHeight()
 *
 * Returns an integer for container height based on current window size.
 *
 * ###### createGraphLoader(selector, data, chart)
 *
 * Returns a function that renders an interactive, responsive `nvd3.js` chart passed in the arguments at the selector with the data
 * that are also passed in the arguments.
 *
 * ###### loadChart(selector, data)
 *
 * Renders `nvd3.js` chart at selector string with the passed-in data.
 *
 * ###### colorizeTrends(prettyData)
 *
 * Updates the passed-in array's objects with a color property based on each objects day of week in their `key` property.
 *
 * ###### toMondayTimestamp(timestamp, dayOfWeek)
 *
 * Returns the ISOString for the Monday of week of the submitted `Date` timestamp.
 *
 * ###### prettifyProductivity(riderships)
 *
 * Transforms service hour objects into an array of objects keyed to `key` and `values` to facilitate `nvd3.js` chart rendering.
 *
 * ###### prettifyProductivity(riderships)
 *
 * Transforms daily ridership objects into an array of objects keyed to `key` and `values` to facilitate `nvd3.js` chart rendering.
 *
 * ###### chartDailies(riderships)
 *
 * Manages ordering and prettifying of daily ridership data before chart rendering.
 *
 * ###### chartHours(riderships)
 *
 * Manages ordering and prettifying of service hour data before chart rendering.
 *
 */
export default Ember.Component.extend({
  /** String to main header in UI template. Default: `null` */
  header: null,

  /** Route data object. Keyed to `serviceHourRiderships` and `dailyRiderships`. Default: `null` */
  route: null,

  /** Loads chart rendering or 'Data unavailable' header message */
  didRender() {
    d3.selectAll('.nvd3-svg').remove();
    if (this.get('route')) {
      chartHours(this.get('route.serviceHourRiderships'));
      chartDailies(this.get('route.dailyRiderships'));
    } else {
      this.set('header', 'Data unavailable for this route.');
    }
  }
});

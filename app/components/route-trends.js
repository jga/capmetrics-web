import Ember from 'ember';
import fillEmptyPoints from 'capmetrics-web/utils/fill-empty-points';

let convertTimeStamps = function(d){
  //let isotime = d[0];
  //let format = d3.time.format("%Y-%m-%dT%H:%M:%S%Z");
  //format.parse(isotime);
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

  // sort keys in ascending alphabetical order
  //data.sort(function(a, b) {
    //if (a.key > b.key) { return 1 };
    //if (a.key < b.key) { return -1 };
    //return 0;
  //});
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

// A monday timestamp helps align the x coordinate in the visualization
// across the days of the week
let toMondayTimestamp = function(timestamp, dayOfWeek) {
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

export default Ember.Component.extend({
  header: null,
  route: null,

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

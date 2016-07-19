import Ember from 'ember';
import fillEmptyPoints from 'capmetrics-web/utils/fill-empty-points';
import DayOfWeekColors from 'capmetrics-web/utils/day-of-week-colors';

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
    return 400;
  } else {
    return 300;
  }
}

let createGraphLoader = function(selector, data, chart) {
  chart = configureChart(chart);
  let svgContainerHeight = getContainerHeight();
  return function loader(){
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
    let color = DayOfWeekColors.weekday ;
    if (trend.key === 'saturday') {
      color = DayOfWeekColors.saturday;
    } else if (trend.key === 'sunday') {
      color = DayOfWeekColors.sunday;
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

// Organizes data into days of week, sorts the days of week
// in expected order, and colorizes (adds a color property and value)
// to each ridership trend object
let prettifyRiderships = function(riderships) {
  let prettyData = Ember.A();
  riderships.forEach(function(ridership){
    let dayOfWeek = ridership.dayOfWeek;
    let mondayTimestamp = toMondayTimestamp(ridership.measurementTimestamp, dayOfWeek);
    let roundedRidership = Math.round(ridership.ridership);
    let adjustedCount = dayOfWeek === 'weekday' ? roundedRidership * 5 : roundedRidership;
    let ridershipTrend = prettyData.findBy('key', ridership.dayOfWeek);
    if (ridershipTrend) {
      ridershipTrend['values'].pushObject([mondayTimestamp, adjustedCount])
    } else {
      let starterValues = Ember.A()
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
    if (a.key === 'saturday' && b.key === 'sunday') {return -1}
    if (a.key === 'saturday' && b.key === 'weekday') {return 1}
    if (a.key === 'sunday') { return 1 }
    return 0;
  });
  prettyData = colorizeTrends(prettyData);
  let filled = fillEmptyPoints(prettyData);
  return filled;
}

let loadCharts = function(routeCompendiums, charts) {
  routeCompendiums.forEach(function(routeCompendium) {
    // Avoid rerendering during each loop in template
    if (!charts || !charts.hasOwnProperty(routeCompendium.selector)) {
      //riderships is an array of ridership fact JSON object (e.g. DailyRidership)
      let prettyData = prettifyRiderships(routeCompendium.riderships);
      let chart = loadChart(routeCompendium.selector, prettyData);
      charts[routeCompendium.selector] = chart;
    }
  })
  return charts;
}

export default Ember.Component.extend({

  charts: null,

  didInsertElement() {
    this.set('charts', {})
  },

  didRender() {
    if (this.get('routeCompendiums')) {
      let routeCompendiums = this.get('routeCompendiums');
      let charts = loadCharts(routeCompendiums, this.get('charts'));
      this.set('charts', charts);
    }
  },

});

import Ember from 'ember';

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
  window.console.log(selector);
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

let prettifyRiderships = function(riderships) {
  let prettyData = Ember.A();
  riderships.forEach(function(ridership){
    let ridershipTrend = prettyData.findBy('key', ridership.dayOfWeek);
    if (ridershipTrend) {
      ridershipTrend['values'].pushObject([ridership.measurementTimestamp, ridership.ridership])
    } else {
      let starterValues = Ember.A()
      starterValues.pushObject([
        ridership.measurementTimestamp,
        ridership.ridership
      ]);
      let ridershipTrend = {
        'key': ridership.dayOfWeek,
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
  return prettyData;
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
      let charts = loadCharts(this.get('routeCompendiums'), this.get('charts'));
      this.set('charts', charts);
    }
  },

});

import Ember from 'ember';

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
    marginBottom: 50;
    showControls = true;
    showLegend = true;
    let svgContainerHeight = 400;
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
  if (size.width >= 768) return 400;
  return 300;
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
    let ridershipTrend = prettyData.findBy('key', ridership.get('dayOfWeek'));
    if (ridershipTrend) {
      ridershipTrend['values'].pushObject([ridership.get('measurementTimestamp'), ridership.get('ridership')])
    } else {
      let starterValues = Ember.A()
      starterValues.pushObject([
        ridership.get('measurementTimestamp'),
        ridership.get('ridership')
      ]);
      let ridershipTrend = {
        'key': ridership.get('dayOfWeek'),
        'values': starterValues
      }
      prettyData.pushObject(ridershipTrend);
    }
  })
  prettyData.sort(function(a, b) {
    if (a.key === 'weekday') { return -1 };
    if (a.key === 'saturday' && b.key === 'sunday') {return -1}
    if (a.key === 'saturday' && b.key === 'weekday') {return 1}
    if (a.key === 'sunday') { return 1 };
    return 0;
  });
  prettyData = colorizeTrends(prettyData);
  return prettyData;
}

export default Ember.Component.extend({
  didRender(){
    this.get('route.dailyRiderships').then(function(riderships){
      riderships = riderships.sortBy('measurementTimestamp');
      let prettyData = prettifyRiderships(riderships);
      window.console.log(JSON.stringify(prettyData))
      loadChart('daily-ridership-trend__viz', prettyData);
    })
  },
});

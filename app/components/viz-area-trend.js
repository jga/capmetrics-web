import Ember from 'ember';

/**
 * Transforms ISO 8601 timestamps provided by Gol API into
 * more easily readable strings for chart x-axis ticks.
 */
let convertTimeStamps = function(d){
  var isotime = d[0];
  var format = d3.time.format("%Y-%m-%dT%H:%M:%S%Z");
  return format.parse(isotime);
}

let createGraphLoader = function(target, data, chart) {
  return function loader(){
    d3.select(target).append('svg')
      .datum(data)
      .transition().duration(500)
      .call(chart);
    var manager = nv.utils.windowResize(function() {
      let size = nv.utils.windowSize();
      if (size.width < 768) {
        chart.showControls(false);
        chart.showLegend(false);
      } else {
        chart.showControls(true);
        chart.showLegend(true);
      }
      chart.update();
    });
    chart.clear = manager.clear;
    return chart;
  }
}


let createChart = function(title, selector, data) {
  let chart = nv.models
            .stackedAreaChart()
            .useInteractiveGuideline(true)
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1] })
            .controlLabels({stacked: "Stacked"})
            .duration(300);
  let size = nv.utils.windowSize();
  if (size.width < 768) {
    chart.showControls(false);
    chart.showLegend(false);
  } else {
    chart.showControls(true);
    chart.showLegend(true);
    chart.legend.vers('furious');
  }
  chart.xAxis.tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
  chart.yAxis.tickFormat(d3.format(',.4f'));
  chart.margin({
      top: 10,
      right: 50,
      bottom: 10,
      left: 50
  });
  chart.height(140);
  let target = '#' + selector;
  nv.addGraph(createGraphLoader(target, data, chart));
  return chart;
}

let createLineChart = function(title, selector, values){
  var chart = nv.models
                .lineChart()
                .x(convertTimeStamps)
                .y(function(d){ return d[1]; })
                .forceY(0)
                .showLegend(false)
                .useInteractiveGuideline(true);
         //.tickFormat(d3.format(',.1%'))
         //.axisLabel('Percent');
    //chart.xAxis
         //.tickFormat(function(d){
           //var format = d3.time.format("%Y-%m-%dT%H:%M:%S%Z");
           //return format.parse(d);
         //});
    chart.margin({
        top: 10,
        right: 20,
        bottom: 10,
        left: 50
    });
    chart.height(140)
    chart.xAxis
         .tickFormat(function(d){
            var format = d3.time.format('%x')
            return format(new Date(d));
         })
         .showMaxMin(false);
    chart.yAxis
         .tickFormat(function(d){ return d3.round(d) })
         .ticks(3)
         .showMaxMin(true);
  var data = [{'key': title, 'values': values, area: true, fillOpacity:.10}];
  var target = '#' + selector;
  nv.addGraph(createGraphLoader(target, data, chart));
  return chart;
}



let SAMPLEDATA = [
    {"key": "series 1", "values": [ [ 1138683600000 , 27] , [ 1141102800000 , 45] ]},
    {"key": "series 2", "values": [ [ 1138683600000 , 32] , [ 1141102800000 , 32] ]},
    {"key": "series 3", "values": [ [ 1138683600000 , 17] , [ 1141102800000 , 7] ]},
]

export default Ember.Component.extend({
  series: SAMPLEDATA,
  visualizationId: 'viz1',
  title: 'CMX Viz 1',

  didInsertElement: function prepareInteractiveUI() {
    let configuration = {
      'series': this.get('series'),
      'selector': this.get('visualizationId'),
      'title': this.get('title'),
    };
    let chart = createChart(this.get('title'), this.get('visualizationId'), this.get('series'));
    this.set('visualization', chart);
  }
});

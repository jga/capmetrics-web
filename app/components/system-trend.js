/**
 * Visualizes trends with an area chart.
 *
 * @module components/viz-area-trend
 */
import Ember from 'ember';
import fillEmptyPoints from 'capmetrics-web/utils/fill-empty-points';
import transitServiceColors from 'capmetrics-web/utils/service-colors';

let colorizeTrends = function(datum) {
  for (let i = 0; i < datum.length; i++) {
    let data = datum[i];
    let color = 'purple';
    if (transitServiceColors.hasOwnProperty(data.key)) {
      color = transitServiceColors[data.key];
    }
    data.color = color;
  }
  return datum;
}

// Transforms ISO 8601 timestamps provided by Capmetrics API into
// more easily readable strings for chart x-axis ticks.
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
    chartHeight = 400;
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
  chart.legend.margin({bottom: 20});
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
  // sort keys in ascending alphabetical order
  data.sort(function(a, b) {
    if (a.key > b.key) { return 1 }
    if (a.key < b.key) { return -1 }
    return 0;
  });
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
        let newHeight = getContainerHeight();
        d3.select(selector + ' .nvd3-svg')
          .style({'height': newHeight + 'px'});
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
    }
  }
}

/**
 * Handles the creation of a stacked chart visualization.
 *
 * @inner
 * @param {string} title A chart title
 * @param {string} selector An id CSS selector
 * @param {array} data An array of data points for visualization.
 */
let toStackedChart = function(title, selector, data) {
  let chart = nv.models
                .stackedAreaChart()
                .useInteractiveGuideline(true)
                .x(convertTimeStamps)
                .y(function(d) { return parseInt(d[1]) })
                .controlLabels({ stacked: "Stacked" })
                .duration(300);
  chart.legend.vers('furious');
  chart.xAxis.tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });
  chart.yAxis.tickFormat(d3.format(','));
  nv.addGraph(createGraphLoader(('#' + selector), data, chart));
  return chart;
}

/** Exports an extension of Ember's Component class. */
export default Ember.Component.extend({
  /** A D3-powered visualization. */
  chart: null,

  /**
   * The trend models.
   * @type {Array}
   */
  trends: null,

  /**
  * The name of the CSS id selector where the visualization will be inserted.
  * @type {String}
  * */
  vizId: null,

  /**
   * The visualization title.
   * @type {String}
   */
  title: null,

  /**
  * A computed property that transformes the series data.
  * @inner
  * @function
  * @return {Array} An array with *trend* objects containing `key`, `values`, and `color` properties.
  */
  vizData: Ember.computed('trends', function() {
    let models = this.get('trends');
    if (models) {
      let vizReady = []
      for (let i = 0; i < models.get('length'); i++) {
        let data = {
          'key': models.objectAt(i).get('serviceType'),
          'values': models.objectAt(i).get('trend')
        }
        vizReady.push(data);
      }
      let colorized = colorizeTrends(vizReady);
      let filled = fillEmptyPoints(colorized);
      return filled;
    }
  }),

  /** Inserts the chart */
  didInsertElement() {
    if (this.get('vizData')) {
      let chart = toStackedChart(this.get('title'), this.get('vizId'), this.get('vizData'));
      this.set('chart', chart);
    }
  }
});

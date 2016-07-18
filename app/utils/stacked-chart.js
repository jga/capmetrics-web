/**
 * Stacked chart handler.
 *
 * @module utils/stacked-chart
 */

 // Transforms ISO 8601 timestamps provided by Capmetrics API into
 // more easily readable strings for chart x-axis ticks.
let convertTimeStamps = function(d){
  //let isotime = d[0];
  //let format = d3.time.format("%Y-%m-%dT%H:%M:%S%Z");
  //format.parse(isotime);
  let result = Date.parse(d[0]);
  return result;
}

let configureChart = function(chart, originalDispatch) {
  // set mobile-first defaults
  let chartHeight = 250;
  let marginTop = 10;
  let marginBottom = 10;
  let marginLeft = 50;
  let marginRight = 50;
  let showControls = false;
  let showLegend = false;
  let showGuideline = false;
  let showTooltip = false;
  // adjust settings based on window size
  let size = nv.utils.windowSize();
  if (size.width >= 768) {
    chartHeight = 400;
    marginBottom = 50;
    showControls = true;
    showLegend = true;
    showGuideline = true;
    showTooltip = true;
    console.log('RICH DISPATCH')
    chart.dispatch = originalDispatch;
  } else {
    console.log('QUIET DISPATCH')
    chart.on('areaMouseover', null);
    chart.on('areaMouseout', null);
    chart.on('elementMouseover', null);
    chart.on('elementMouseout', null);
    chart.on('areaClick', null);
    chart.on('elementClick', null);
    chart.on('elementMouseover.tooltip', null);
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
  chart.useInteractiveGuideline(showGuideline);
  //chart.tooltip.options({'enabled': showTooltip});
  chart.tooltip.options.enabled = showTooltip;
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
  let originalDispatch = chart.dispatch;
  // sort keys in ascending alphabetical order
  data.sort(function(a, b) {
    if (a.key > b.key) { return 1 }
    if (a.key < b.key) { return -1 }
    return 0;
  });
  chart = configureChart(chart, originalDispatch);
  let svgContainerHeight = getContainerHeight();
  return function loader() {
    try {
      d3.select(selector).append('svg')
        .datum(data)
        .transition().duration(500)
        .call(chart)
        .style({'height': svgContainerHeight + 'px'});
      let manager = nv.utils.windowResize(function() {
        chart = configureChart(chart, originalDispatch);
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
export default function(title, selector, data) {
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

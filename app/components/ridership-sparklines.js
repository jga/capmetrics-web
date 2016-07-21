/** @module components/ridership-sparklines */
import Ember from 'ember';

let loadSparkline = function(selector, sparkDataset) {

  var sparkMargins = {
    top: 10,
    bottom: 10,
    left: 50,
    right: 50
  }

  var containerHeight = 100;
  var containerWidth = 300;
  var sparkHeight = containerHeight - sparkMargins.top - sparkMargins.bottom;
  var sparkWidth = containerWidth - sparkMargins.left - sparkMargins.right;

  var sparkDateFormatter = d3.time.format.iso;

  var sparkX = d3.time.scale()
                 .domain(d3.extent(sparkDataset, function(d) { return sparkDateFormatter.parse(d.date); }))
                 .range([0, sparkWidth]);

  var yExtent = d3.extent(sparkDataset, function(d) { return d.ridership; })

  var sparkY = d3.scale.linear()
                 .domain([0, yExtent[1]])
                 .range([sparkHeight, 0]);

  var impactScale = d3.scale.linear()
                      .domain([0, 55000])
                      .range([1, 10])

  var sparkYAxis = d3.svg.axis()
      .scale(sparkY)
      .orient("left")
      .tickValues([0, Math.round((yExtent[1]/2)), yExtent[1]])
      .tickFormat(function(d) {
        if (d > 1000) {
          return (d/1000).toFixed(2) + 'k';
        } else {
          return Math.round(d);
        }
      })

  var sparkline = d3.svg.line()
      .x(function(d) { return sparkX(sparkDateFormatter.parse(d.date)); })
      .y(function(d) { return sparkY(d.ridership); });

  var impactFormatter = d3.format(",");
  var rawLatestValue = Math.round(sparkDataset[sparkDataset.length - 1].ridership);
  var latestValue = impactFormatter(rawLatestValue);
  var impact = function() {
    let ridershipValue = sparkDataset[sparkDataset.length - 1].ridership;
    return impactScale(ridershipValue);
  }
  var latestValueX = sparkX(sparkDateFormatter.parse(sparkDataset[sparkDataset.length - 1].date)) + impact() + 2;

  var targetElement = '#' + selector;
  var sparkSVG = d3.select(targetElement).append("svg")
              .attr("width", containerWidth)
              .attr("height", containerHeight)
            .append("g")
              .attr("transform", "translate(" + sparkMargins.left + "," + sparkMargins.top + ")");

  sparkSVG.append("path")
        .datum(sparkDataset)
        .attr("class", "ridership-sparkline")
        .attr("d", sparkline);

  sparkSVG.append('circle')
       .attr('class', 'ridership-sparkline__impact')
       .attr('cx', sparkX(sparkDateFormatter.parse(sparkDataset[sparkDataset.length - 1].date)))
       .attr('cy', sparkY(sparkDataset[sparkDataset.length - 1].ridership))
       .attr('r', impact)
       .attr('opacity', 0.75)

  sparkSVG.append("text")
       .attr('class', 'ridership-sparkline__latest-value')
       .attr('x', latestValueX)
       .attr('y', (sparkY(sparkDataset[sparkDataset.length - 1].ridership)) + 3)
       .text(latestValue);

  sparkSVG.append("g")
        .attr("class", "ridership-sparkline__y-axis")
        .call(sparkYAxis)
      .append("text")
        .attr('class', 'ridership-sparkline__units')
        .attr("transform", "rotate(-90)")
        .attr("y", 4)
        .attr("x", -50)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("rides");

  return sparkSVG;
}

let loadSparklines = function(routeCompendiums, sparklines) {
  routeCompendiums.forEach(function(routeCompendium) {
    // Avoid rerendering during each loop in template
    if (!sparklines || !sparklines.hasOwnProperty(routeCompendium.selector)) {
      //riderships is an array of ridership fact JSON object (e.g. DailyRidership)
      let sparkline = loadSparkline(routeCompendium.selector, routeCompendium.data);
      sparklines[routeCompendium.selector] = sparkline;
    }
  })
  return sparklines;
}

/**
 * Exports an extension of `Ember.component`.
 *
 * This module has several **private** functions.
 *
 * ###### loadSparkline(selector, sparkDataset)
 *
 * Renders a sparkline visualization.
 *
 * The parameters are a data array and an identifier string that will be used as a CSS selector.
 *
 * Returns a `d3` selection.
 *
 * ###### loadSparklines(routeCompendiums, sparklines)
 *
 * Iterates through route compendium objects to render sparklines.
 *
 * The parameters are a data array and an object with already-rendered sparklines keyed to selector labels.
 *
 * Returns an updated `sparklines` object.
 */
export default Ember.Component.extend({
  /** Object holds already-renderd `d3` sparklines. Keyed to visualization selector. Default: `null` */
  sparklines: null,

  /** Sets `sparklines` to empty object. */
  didInsertElement() {
    this.set('sparklines', {})
  },

  /** Invokes sparkline rendering */
  didRender() {
    if (this.get('compendiums')) {
      let sparklines = loadSparklines(this.get('compendiums'), this.get('sparklines'));
      this.set('sparklines', sparklines);
    }
  },

  /** Removes `d3` SVGs */
  willDestroyElement() {
    // remove d3 svg
    if (this.get('sparklines')) {
      var self = this;
      Object.keys(this.get('sparklines')).forEach(function(key){
        self.get('sparklines')[key].select('svg').remove();
      })
    }
  }

});

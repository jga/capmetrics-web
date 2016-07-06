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

  var sparkDateFormatter = d3.time.format("%d-%b-%y");

  var sparkX = d3.time.scale()
                 .domain(d3.extent(sparkDataset, function(d) { return sparkDateFormatter.parse(d.date); }))
                 .range([0, sparkWidth]);

  var yExtent = d3.extent(sparkDataset, function(d) { return d.value; })

  var sparkY = d3.scale.linear()
                 .domain(yExtent)
                 .range([sparkHeight, 0]);

  var sparkXAxis = d3.svg.axis()
      .scale(sparkX)
      .orient("bottom");

  var sparkYAxis = d3.svg.axis()
      .scale(sparkY)
      .orient("left")
      .tickValues([yExtent[0], (((yExtent[1] - yExtent[0])/2) + yExtent[0]), yExtent[1]]);

  var sparkline = d3.svg.line()
      .x(function(d) { return sparkX(sparkDateFormatter.parse(d.date)); })
      .y(function(d) { return sparkY(d.value); });

  var sparkSVG = d3.select(selector).append("svg")
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
       .attr('cy', sparkY(sparkDataset[sparkDataset.length - 1].value))
       .attr('r', function() {
         let ridershipValue = sparkDataset[sparkDataset.length - 1].value * 0.10;
         let impact = Math.sqrt(ridershipValue);
         if impact < 1 {
          return 1;
         } else if impact > 10 {
          return 10;
         } else {
          return impact;
         }
       })
       .attr('opacity', 0.75)

  sparkSVG.append("text")
       .attr('class', 'ridership-sparkline__latest-value')
       .attr('x', (sparkX(sparkDateFormatter.parse(sparkDataset[sparkDataset.length - 1].date))) + 7)
       .attr('y', (sparkY(sparkDataset[sparkDataset.length - 1].value)) + 3)
       .text(sparkDataset[sparkDataset.length - 1].value);

  sparkSVG.append("g")
        .attr("class", "ridership-sparkline__y-axis")
        .call(sparkYAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
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
  return charts;
}


export default Ember.Component.extend({
  sparklines: null,

  didInsertElement() {
    this.set('sparklines', {})
  },

  didRender() {
    if (this.get('compendiums')) {
      let sparklines = loadSparklines(this.get('compendiums'), this.get('sparklines'));
      this.set('sparklines', sparklines);
    }
  },
});

import Ember from 'ember';

var updateDimensions = function(windowWidth) {
  let availableWidth = Math.round(windowWidth * .8);
  let breakpoint = 720;
  let dimensions = {};
  dimensions.marginTop = availableWidth < breakpoint ? 10 : 35;
  dimensions.marginBottom = availableWidth < breakpoint ? 30 : 35;
  dimensions.marginRight = availableWidth < breakpoint ? 10 : 35;
  dimensions.marginLeft = availableWidth < breakpoint ? 30 : 35;
  let fullWidth = availableWidth - dimensions.marginLeft - dimensions.marginRight
  dimensions.width = fullWidth > 900 ? 900 : fullWidth;
  dimensions.height = availableWidth < breakpoint ? Math.round(0.9 * dimensions.width) : Math.round(.5 * dimensions.width);
  dimensions.visHeight = dimensions.height - dimensions.marginTop - dimensions.marginBottom;
  dimensions.visWidth = dimensions.width - dimensions.marginLeft - dimensions.marginRight;
  return dimensions;
}

var loadScatterVisualization = function(dataSeries, visLabel) {

    // extents
    var yExtent = d3.extent(dataSeries, function(d) { return d.productivity ? d.productivity : 0; })
    var xExtent = d3.extent(dataSeries, function(d) { return d.ridership ? d.ridership : 0; ; })

    // scales
    var xScale = d3.scale.linear()
                         .domain([0, (xExtent[1] + 500)])

    var yScale = d3.scale.linear()
                         .domain([0, yExtent[1] + 10])

    // axes
    var yAxis = d3.svg.axis()
                      .ticks(5)
                      .orient("left")

    var xAxis = d3.svg.axis()
                      .ticks(5)
                      .orient("bottom")

    let selector = '#' + visLabel;
    var svgContainer = d3.select(selector).append("svg")
                         .attr("class", "productivity-scatter__vis-container")

    var scatterVis = svgContainer.append("g").attr("class", "productivity-scatter__vis")

    scatterVis.append("g")
              .attr("class", "productivity-scatter_x productivity-scatter__axis")
            .append("text")
              .attr("class", "productivity-scatter__x-label")

    scatterVis.append("g")
              .attr("class", "productivity-scatter_y productivity-scatter__axis")
            .append("text")
              .attr("class", "productivity-scatter__y-label")

    var circles = scatterVis.selectAll("g")
                            .data(dataSeries)
                            .enter()
                            .append("g")
                            .attr("class", "productivity-scatter__cirlces")

    circles.append("circle")
          .attr("class", "productivity-scatter__dot")

    circles.append("circle")
          .attr("class", "productivity-scatter__dot-center")

    circles.append("text")
         .attr('class', 'productivity-scatter__point-route')

    var ridershipColorScale = d3.scale.linear()
                   .range([155, 255])
                   .domain([0, xExtent[1]])

    var productivityColorScale = d3.scale.linear()
                   .range([0, 255])
                   .domain([0, yExtent[1]])

    var colorize = function(ridership, productivity) {
      var productivityColor = productivityColorScale(productivity);
      var ridershipColor = Math.round(ridershipColorScale(ridership) - (3 * productivityColor));
      ridershipColor = ridershipColor < 0 ? 0 : ridershipColor;
      var finalColor = d3.rgb('rgb(' + ridershipColor + ',0,' + productivityColor + ')');
      return finalColor;
    }

    var brightColorize = function(ridership, productivity) {
      var productivityColor = productivityColorScale(productivity);
      var ridershipColor = Math.round(ridershipColorScale(ridership) - productivityColor);
      ridershipColor = ridershipColor < 0 ? 0 : ridershipColor;
      var hslColor = d3.hsl('rgb(' + ridershipColor + ',0,' + productivityColor + ')');
      var finalColor = d3.hsl(hslColor.h, 0.9, 0.97);
      return finalColor;
    }

    //render function
    var render = function() {
      // dimensions
      var dimensions = updateDimensions(window.innerWidth);
      var containerHeight = dimensions.height;
      var containerWidth = dimensions.width;
      // scales
      xScale.range([0, dimensions.visWidth])
      yScale.range([dimensions.visHeight, 0])

      svgContainer
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

      scatterVis
        .attr("transform", "translate(" + dimensions.marginLeft + "," + dimensions.marginTop + ")");

      scatterVis.select('.productivity-scatter_x.productivity-scatter__axis')
            .attr("transform", "translate(0," + dimensions.visHeight + ")")
            .call(xAxis.scale(xScale))
          .select('.productivity-scatter__x-label')
            .attr("x", dimensions.visWidth)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("ridership");

      scatterVis.select('.productivity-scatter_y.productivity-scatter__axis')
                .call(yAxis.scale(yScale))
              .select('.productivity-scatter__y-label')
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("rides/hour")

     circles.selectAll(".productivity-scatter__dot")
            .attr("r", 12.0)
            .attr("cx", function(d) {
              let value = d.ridership ? d.ridership : 0;
              return xScale(value);
            })
            .attr("cy", function(d) {
              let value = d.productivity ? d.productivity : 0;
              return yScale(value);
            })
            .style("fill", function(d) { return colorize(d.ridership, d.productivity) })

     circles.selectAll(".productivity-scatter__dot-center")
            .attr("r", 10.0)
            .attr("cx", function(d) {
              let value = d.ridership ? d.ridership : 0;
              return xScale(value);
            })
            .attr("cy", function(d) {
              let value = d.productivity ? d.productivity : 0;
              return yScale(value);
            })
            .style("fill", function(d) { return brightColorize(d.ridership, d.productivity) })

    circles.selectAll(".productivity-scatter__point-route")
           .attr('text-anchor', "middle")
            .attr("x", function(d) {
              let value = d.ridership ? d.ridership : 0;
              return xScale(value);
            })
           .attr('y', function(d) { return yScale(d.productivity) + 4 })
            .attr("y", function(d) {
              let value = d.productivity ? d.productivity : 0;;
              return yScale(value) + 4;
            })
           .text(function(d) {return d.routeNumber})
    }

    render();
    let eventType = 'resize.' + visLabel;
    d3.select(window).on(eventType, render);
    return svgContainer;
}


export default Ember.Component.extend({

  actions: {
    toggleDetail() {
      this.toggleProperty('showDetail');
    }
  },

  didRender() {
    if (this.get('periodPerformance')) {
      var dataSeries = this.get('periodPerformance')['performance']
      if (!this.get('scatterVisualization')) {
        let scatterVisualization = loadScatterVisualization(dataSeries,
                                                            this.get('scatterVisualizationIdentifier'));
        this.set('scatterVisualization', scatterVisualization);
      }
    }
  },

  periodPerformance: Ember.computed('periodPerformances', function() {
    if (this.get('periodPerformances')) {
      return this.get('periodPerformances')[0];
    } else {
      return null;
    }
  }),

  latestPerformance: Ember.computed('periodPerformance', function() {
    if (this.get('periodPerformance')) {
      return this.get('periodPerformance.performance');
    } else {
      return null;
    }
  }),

  prettyDate: Ember.computed('periodPerformance', function(){
    var monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
    let periodDate = new Date(this.get('periodPerformance')['date']);
    return monthNames[periodDate.getMonth()] + ' ' + periodDate.getFullYear().toString();
  }),
  showDetail: false,
  scatterVisualization: null,

  scatterVisualizationIdentifier: Ember.computed('periodPerformance', function(){
    let periodDate = new Date(this.get('periodPerformance')['date']);
    return 'scatter-vis-' + periodDate.getMonth().toString() + '-' + periodDate.getYear().toString();
  }),

  willDestroyElement() {
    // remove d3 svg
    if (this.get('scatterVisualization')) {
      let selector = '#' + this.get('scatterVisualizationIdentifer');
      d3.select(selector).select('svg').remove();
    }
    // remove resize listener
    d3.select(window).on('resize',null);
  }
});


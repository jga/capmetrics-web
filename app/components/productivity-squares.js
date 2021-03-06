/** @module components/productivity-squares */
import Ember from 'ember';
import productivityColors from 'capmetrics-web/utils/productivity-colors';

var getDimensions = function(windowWidth) {
  let availableWidth = Math.round(windowWidth * 0.8);
  let breakpoint = 500;
  let dimensions = {};
  dimensions.squareGap = 1;
  dimensions.marginTop = 10;
  dimensions.marginBottom = 10;
  dimensions.marginRight = 10;
  dimensions.marginLeft = 10;
  dimensions.width = availableWidth > breakpoint ? breakpoint : availableWidth;
  dimensions.visWidth = dimensions.width - dimensions.marginLeft - dimensions.marginRight;
  // 19 columns give us a max of 95 route data points
  dimensions.squareEdge = Math.floor((dimensions.visWidth - (19 * dimensions.squareGap)) / 19);
  // 5 rows is the hard-wired size in the chart
  dimensions.height = (dimensions.squareEdge) * 5 + (dimensions.squareGap * 6) + dimensions.marginTop + dimensions.marginBottom;
  dimensions.visHeight = dimensions.height - dimensions.marginTop - dimensions.marginBottom + 1;
  return dimensions;
}

var getWindowWidth = function() {
  return window.innerWidth;
}

var colorize = function(value) {
  if (!value) {
    return 'white';
  } else if (value < 10) {
    return productivityColors.veryLow;
  } else if (value < 20) {
    return productivityColors.low;
  } else if (value < 30) {
    return productivityColors.middle;
  } else if (value < 40) {
    return productivityColors.high;
  } else {
    return productivityColors.veryHigh;
  }
}

var loadSquareVisualization = function(dataSeries, visLabel) {

  var squaresPerColumn = 5;
  var squareCount = dataSeries.length;

  var selector = '#' + visLabel;
  var svgContainer = d3.select(selector)
                      .append('svg')
                       .attr('class', 'productivity-squares__vis')
  var countText = svgContainer.append('text').attr('class', 'productivity-squares__count-label');
  var squares = svgContainer.append("g")
                        .selectAll("div")
                        .data(dataSeries)
                        .enter()
                        .append("rect")

  var renderSquares = function() {
    let windowWidth = getWindowWidth();
    let dimensions = getDimensions(windowWidth);

    d3.select(selector).select('.productivity-squares__vis')
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)

    squares
      .attr("width", dimensions.squareEdge)
      .attr("height", dimensions.squareEdge)
      .attr("fill", function(d) {
        return colorize(d.productivity);
      })
      .attr("x", function(d, i) {
        //group n squares for column
        let col = Math.floor((i / squaresPerColumn));
        return (col * dimensions.squareEdge) + (col * dimensions.squareGap);
      })
      .attr("y", function(d, i) {
        let row = squaresPerColumn - (i % squaresPerColumn);
        return (squaresPerColumn * (dimensions.squareEdge + dimensions.squareGap)) - ((row * dimensions.squareEdge) + (row * dimensions.squareGap))
      })

    let rideCountLabel = squareCount + ' routes';
    countText
          .attr("x", 46)
          .attr("y", dimensions.visHeight + 11)
          .style("text-anchor", "end")
          .text(rideCountLabel)
  }

  renderSquares();
  let eventType = 'resize.' + visLabel;
  d3.select(window).on(eventType, renderSquares);
  return svgContainer;
}


/**
 * Exports extension of `Ember.component`.
 *
 * The module has several **private** functions.
 *
 * ###### getDimensions(windowWidth)
 *
 * Generates an object with dimension data based on passed width number.
 *
 * Returns an object with `squareGap`, `squareEdge`, `marginTop`, `marginBottom`, `marginRight`, `marginLeft`, `width`, `height`, `visHeight`, `visWidth` keys.
 *
 * ###### getWindowWidth()
 *
 * Returns browser window's `innerWidth`.
 *
 * ###### colorize(value)
 *
 * Returns string with CSS color based on day of week value passed.
 *
 * ###### loadSquareVisualization(dataSeries, visLabel)
 *
 * Renders a square distribution/waffle visualization.
 *
 * The parameters are a data array and an identifier string that will be used as a CSS selector.
 *
 * Returns a `d3` selection.
 */
export default Ember.Component.extend({

  /**
   * Component actions object.
   *
   * ###### toggleDetail()
   *
   * Toggles the `showDetail` boolean.
   */
  actions: {
    toggleDetail() {
      this.toggleProperty('showDetail');
    }
  },

  /** Loads square visualization */
  didRender() {
    if (this.get('periodPerformance')) {
      let dataSeries = this.get('periodPerformance')['performance']
      if (!this.get('squareVisualization')) {
        let squareVisualization = loadSquareVisualization(dataSeries,
                                                          this.get('squareVisualizationIdentifier'));
        this.set('squareVisualization', squareVisualization);
      }
    }
  },

  /** Period performance object. Default: `null`. */
  periodPerformance: null,

  /** Computes a string with a month name and four-digit year*/
  prettyDate: Ember.computed('periodPerformance', function() {
    if (this.get('periodPerformance')) {
      let monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
      let periodDate = new Date(this.get('periodPerformance')['date']);
      return monthNames[periodDate.getMonth()] + ' ' + periodDate.getFullYear().toString();
    } else {
      return '';
    }
  }),

  /** Boolean governs whether data details are displayed. Default: `false` */
  showDetail: false,

  /** The `d3` square distribution object. Default: `null` */
  squareVisualization: null,

  /** Computes an identifier string for CSS selection of a DOM element. */
  squareVisualizationIdentifier: Ember.computed('periodPerformance', function() {
    if (this.get('periodPerformance')) {
      let periodDate = new Date(this.get('periodPerformance')['date']);
      return 'square-vis-' + periodDate.getMonth().toString() + '-' + periodDate.getYear().toString();
    } else {
      return 'square-vis-no-data';
    }
  }),

  /** Removes `d3` SVG and resize event listener. */
  willDestroyElement() {
    // remove d3 svg
    if (this.get('squareVisualization')) {
      let selector = '#' + this.get('squareVisualizationIdentifier');
      let squareSvg = d3.select(selector).select('svg')
      if (squareSvg) {
        squareSvg.remove();
      }
    }
    // remove resize listener
    d3.select(window).on('resize',null);
  }
});

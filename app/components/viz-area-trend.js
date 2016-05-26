/**
 * Visualizes trends with an area chart.
 *
 * @module components/viz-area-trend
 */
import Ember from 'ember';
import toStackedChart from 'capmetrics-web/utils/stacked-chart';
import colorizeTrends from 'capmetrics-web/utils/colorize-trends';
import fillEmptyPoints from 'capmetrics-web/utils/fill-empty-points';

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
  vizData: Ember.computed('trends', function(){
    let models = this.get('trends');
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
  }),

  /** Inserts the chart */
  didInsertElement() {
    let chart = toStackedChart(this.get('title'), this.get('vizId'), this.get('vizData'));
    this.set('chart', chart);
  }
});

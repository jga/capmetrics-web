/** @module components/day-legend */
import Ember from 'ember';
import colors from 'capmetrics-web/utils/day-of-week-colors';

/** Exports extension of `Ember.component` */
export default Ember.Component.extend({

  /** A computed property.
   *
   * Returns an array of legend color objects keyed to `dayOfWeek` and `styling`.
   *
   * @type {Function}
   **/
  entries:  Ember.computed(function() {
    let legendColors = Ember.A();
    for (let dayOfWeek in colors) {
      if (!colors.hasOwnProperty(dayOfWeek)) {continue}
      let backgroundColor = Ember.String.htmlSafe('background-color: ' + colors[dayOfWeek]);
      let legendColor = {'dayOfWeek': dayOfWeek, 'styling': backgroundColor}
      legendColors.pushObject(legendColor);
    }
    return legendColors;
  })
});

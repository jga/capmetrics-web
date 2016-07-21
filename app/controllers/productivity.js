/**
 * @module controllers/productivity
 */
import Ember from 'ember';
import productivityColors from 'capmetrics-web/utils/productivity-colors';

/** Exports extension of `Ember.Controller` */
export default Ember.Controller.extend({
  /** A CSS identifier selector.
   *
   * Must not include the hash/pound at the start.
   *
   * @type {String}
   */
  systemVizSelector: 'index-system-ridership-viz',

  /** Returns array of objects keyed to `range` and `color` */
  legendEntries: Ember.computed(function() {
    let entries = [
      {range: '0-9', color: productivityColors.veryLow},
      {range: '10-19', color: productivityColors.low},
      {range: '20-29', color: productivityColors.middle},
      {range: '30-39', color: productivityColors.high},
      {range: '40+', color: productivityColors.veryHigh}
    ]
    return entries;
  }),
});

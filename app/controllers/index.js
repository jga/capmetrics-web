/**
 * @module controllers/index
 */
import Ember from 'ember';

/** Exports extension of `Ember.Controller` */
export default Ember.Controller.extend({
  /** A CSS identifier selector.
   *
   * Must not include the hash/pound at the start.
   *
   * @type {String}
   */
  systemVizSelector: 'index-system-ridership-viz'
});

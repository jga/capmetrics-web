/** @module components/service-legend */
import Ember from 'ember';
import transitServiceColors from 'capmetrics-web/utils/service-colors';

/**
 * Exports extension of `Ember.component`.
 */
export default Ember.Component.extend({

  /** Returns an array of objects with `serviceType` and `styling` keys. */
  entries:  Ember.computed(function() {
    let serviceColors = Ember.A();
    for (let serviceType in transitServiceColors) {
      if (!transitServiceColors.hasOwnProperty(serviceType)) {continue}
      let backgroundColor = Ember.String.htmlSafe('background-color: ' + transitServiceColors[serviceType]);
      let serviceColor = {'serviceType': serviceType, 'styling': backgroundColor}
      serviceColors.pushObject(serviceColor);
    }
    return serviceColors;
  })
});

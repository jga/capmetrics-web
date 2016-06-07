import Ember from 'ember';
import transitServiceColors from 'capmetrics-web/utils/service-colors';

export default Ember.Component.extend({

  entries:  Ember.computed(function(){
    let serviceColors = Ember.A();
    for (let serviceType in transitServiceColors) {
      if (!transitServiceColors.hasOwnProperty(serviceType)) {continue};
      let backgroundColor = Ember.String.htmlSafe('background-color: ' + transitServiceColors[serviceType]);
      let serviceColor = {'serviceType': serviceType, 'styling': backgroundColor}
      serviceColors.pushObject(serviceColor);
    }
    return serviceColors;
  })
});

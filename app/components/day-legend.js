import Ember from 'ember';
import colors from 'capmetrics-web/utils/day-of-week-colors';

export default Ember.Component.extend({

  entries:  Ember.computed(function(){
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

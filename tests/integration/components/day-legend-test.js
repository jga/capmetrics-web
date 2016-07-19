import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('day-legend', 'Integration | Component | day legend', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{day-legend}}`);
  assert.equal(this.$().text().trim().replace(/\s+/g, ''), 'weekdaysaturdaysunday');
  assert.equal(this.$('.day-legend__entry').length, 3);
});

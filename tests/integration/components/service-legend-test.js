import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('service-legend', 'Integration | Component | service legend', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{service-legend}}`);
  assert.equal(this.$('.service-legend__entry').length, 14);
});

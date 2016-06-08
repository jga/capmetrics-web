import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('service-selector', 'Integration | Component | service selector', {
  integration: true
});

test('it renders instructions', function(assert) {
  this.render(hbs`{{service-selector}}`);
  let expected = "Click link to view a route's performance data";
  assert.equal(this.$('.service-selector__instructions').text().trim(), expected);
});

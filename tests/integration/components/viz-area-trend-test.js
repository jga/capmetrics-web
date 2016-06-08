import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('system-trend', 'Integration | Component | system trend', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{system-trend}}`);
  assert.equal(this.$().text().trim(), 'System Ridership Weekly Total Rides');
});

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('top-routes', 'Integration | Component | top routes', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{top-routes}}`);
  assert.equal(this.$().text().trim(), 'Top 10 Weekly Rides');
});

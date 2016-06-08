import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('route-trends', 'Integration | Component | route trends', {
  integration: true
});

test('it renders data absence message', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.render(hbs`{{route-trends}}`);
  assert.equal(this.$('h1').text().trim(), 'Data unavailable for this route.');
});

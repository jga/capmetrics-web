import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('productivity-squares', 'Integration | Component | productivity squares', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{productivity-squares}}`);
  assert.equal(this.$('.productivity-squares__vis-container').length, 1);
  assert.equal(this.$().text().trim(), 'Data');
});

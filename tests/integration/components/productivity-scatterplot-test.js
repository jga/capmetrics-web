import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('productivity-scatterplot', 'Integration | Component | productivity scatterplot', {
  integration: true
});

test('it renders', function(assert) {
  this.render(hbs`{{productivity-scatterplot}}`);
  assert.equal(this.$('.title').length, 1);
});

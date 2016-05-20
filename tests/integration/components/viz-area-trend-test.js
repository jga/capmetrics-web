import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('viz-area-trend', 'Integration | Component | viz area trend', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{viz-area-trend}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#viz-area-trend}}
      template block text
    {{/viz-area-trend}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

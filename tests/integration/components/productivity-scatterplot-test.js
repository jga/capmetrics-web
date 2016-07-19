import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('productivity-scatterplot', 'Integration | Component | productivity scatterplot', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{productivity-scatterplot}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#productivity-scatterplot}}
      template block text
    {{/productivity-scatterplot}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

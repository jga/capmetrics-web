import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ridership-sparklines', 'Integration | Component | ridership sparklines', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ridership-sparklines}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ridership-sparklines}}
      template block text
    {{/ridership-sparklines}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

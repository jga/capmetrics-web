import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('daily-ridership-trend', 'Integration | Component | daily ridership trend', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{daily-ridership-trend}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#daily-ridership-trend}}
      template block text
    {{/daily-ridership-trend}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

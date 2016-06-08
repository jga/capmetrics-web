import { moduleForModel, test } from 'ember-qunit';

moduleForModel('route', 'Unit | Model | route', {
  // Specify the other units that are required for this test.
  needs: ['model:daily-ridership', 'model:service-hour-ridership']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

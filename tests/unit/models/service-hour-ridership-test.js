import { moduleForModel, test } from 'ember-qunit';

moduleForModel('service-hour-ridership', 'Unit | Model | service hour ridership', {
  // Specify the other units that are required for this test.
  needs: ['model:route']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

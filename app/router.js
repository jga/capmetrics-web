/**
 * @module router
 */
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('index', {path: '/'});
  this.route('productivity');
  this.route('route-performance', {path: '/route-performance/:route_number'});
  this.route('routes');
  this.route('system');
  this.route('about');
});

/**
 * Exports an extension of `Ember.Router`
 *
 * The application's router mapping handles the following routes:
 *
 * | **Route**              | **Path**                            |
 * |------------------------|-------------------------------------|
 * | index                  | `/`                                 |
 * | productivity           | `/productivity`                     |
 * | route-performance      | `/route-performance/:route_number`  |
 * | routes                 | `/routes`                           |
 * | system                 | `/system`                           |
 * | about                  | `/about`                            |
 *
 */
export default Router;

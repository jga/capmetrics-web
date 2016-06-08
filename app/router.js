/**
 * The application's router.
 *
 * The handled routes are:
 *
 * | **Route**    | **Path**   |
 * |--------------|------------|
 * | index        | `/`        |
 *
 * @module router
 */
import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('index', {path: '/'});
  this.route('route-performance', {path: '/route-performance/:route_number'});
  this.route('routes');
  this.route('system');
  this.route('about');
});

export default Router;

/**
 * A helper class for managing the `included` member of a JSON API response.
 *
 * @module mirage.route-handlers.included-helper
 */

/**
 * A helper class for managing the `included` member of a JSON API response.
 *
 * This is the module's default export.
 *
 * The constructor function does not take parameters.  When using it
 * in a route handler, instantiation is simple:
 *
 *      let includedHelper = new IncludedHelper()
 *
 * @class included-helper
 * @namespace  mirage.route-handlers
 * @constructor
 */
var IncludedHelper = function IncludedHelper() {
  /**
   *
   * Contains arrays of model identifiers keyed to model types.  This
   * allows for a convenient check to see if a resource is already
   * present in the `included` array.
   *
   * @property keys
   * @type object
   */
  this.keys = {};

  /**
   * An array of resource objects. This array is intended to provide the
   * value for an `included` member in a JSON API document.
   *
   * @property included
   * @type array
   */
  this.included = [];
}

/**
 * Checks if a resource is already saved in the helper.
 *
 * @method contains
 * @param {string} typeName A resource type (e.g. "constructs", "completions").
 * @param {number} primaryKey The resource's primary key.
 * @returns {boolean} `true` if the resource type and key are present. `false` otherwise.
 */
IncludedHelper.prototype.contains = function contains(typeName, primaryKey){
  var isContained = false;
  if (typeName in this.keys) {
    var index = this.keys[typeName].indexOf(primaryKey);
    if (index !== -1){
      //pk contained
      isContained = true;
    }
  }
  return isContained;
}

/**
 * Add single resource object to the helper.
 *
 * @method addResourceObject
 * @param {object} resourceObject JSON API resource object
 * @return {boolean} `true` if a resource was push to the helper's `included` array. `false` otherwise.
 */
IncludedHelper.prototype.addResourceObject = function addResourceObject(resourceObject) {
  // check if other models of same type already processed
  if (resourceObject.type in this.keys) {
    var index = this.keys[resourceObject.type].indexOf(resourceObject.id);
    if (index === -1){
      //pk not there, add it and resource. otherwise skip resource
      this.keys[resourceObject.type].push(resourceObject.id);
      this.included.push(resourceObject);
      return true;
    } else {
      // did not add resource; it is already included
      return false;
    }
  // type not yet processed, so initialize an array an insert pk
  } else {
      this.keys[resourceObject.type] = []
      this.keys[resourceObject.type].push(resourceObject.id);
      this.included.push(resourceObject);
      return true;
  }
}

/**
 * Process resource object(s), adding the resource or resources that are not
 * already saved in the helper's `included` array.
 *
 * @method add
 * @param {object | array} resourcePayload JSON API resource object(s).
 * @return {count | boolean} A count of the resources added or a boolean
 *  whether a single resource was added.
 */
IncludedHelper.prototype.add = function add(resourcePayload) {
  if (resourcePayload instanceof Array){
    var len = resourcePayload.length;
    var count = 0;
    for (var i = 0; i < len; i++) {
      var added = this.addResourceObject(resourcePayload[i]);
      if (added) {
        count++;
      }
    }
    return count;
  } else {
    return this.addResourceObject(resourcePayload);
  }
}

/**
 * Provides an array of resource objects for the `included` member of a JSON API document.
 *
 * @method getIncluded
 * @return {array} Array of JSON API resources.  May be empty.
 */
IncludedHelper.prototype.getIncluded = function getIncludedResourceObjects(){
  return this.included;
}

export default IncludedHelper;


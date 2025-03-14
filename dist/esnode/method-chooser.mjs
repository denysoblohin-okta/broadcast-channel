import NativeMethod from "./methods/native.mjs";
import IndexeDbMethod from "./methods/indexed-db.mjs";
import LocalstorageMethod from "./methods/localstorage.mjs";
import SimulateMethod from "./methods/simulate.mjs"; // the line below will be removed from es5/browser builds

import * as NodeMethod from "./methods/node.mjs";
import { isNode } from "./util.mjs"; // order is important

var METHODS = [NativeMethod, // fastest
IndexeDbMethod, LocalstorageMethod];
export function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean); // the line below will be removed from es5/browser builds

  chooseMethods.push(NodeMethod); // directly chosen

  if (options.type) {
    if (options.type === 'simulate') {
      // only use simulate-method if directly chosen
      return SimulateMethod;
    }

    var ret = chooseMethods.find(function (m) {
      return m.type === options.type;
    });
    if (!ret) throw new Error('method-type ' + options.type + ' not found');else return ret;
  }
  /**
   * if no webworker support is needed,
   * remove idb from the list so that localstorage is been chosen
   */


  if (!options.webWorkerSupport && !isNode) {
    chooseMethods = chooseMethods.filter(function (m) {
      return m.type !== 'idb';
    });
  }

  var useMethod = chooseMethods.find(function (method) {
    return method.canBeUsed();
  });
  if (!useMethod) throw new Error("No useable method found in " + JSON.stringify(METHODS.map(function (m) {
    return m.type;
  })));else return useMethod;
}
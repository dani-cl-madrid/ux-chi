import {util} from "./util.js";
import {chi} from "./chi.js";

console.log("chiModuleB loaded");

util.addClass(document.getElementById("id"), "class");

const className = 'chiModuleb';


function _initModule() {
  let hola = () => className;
  util.addClass(this._elem, "-p3 -b3 " + hola());
}

class ChiModule {

  constructor (elem, config) {
    this._elem = elem;
    this._config = config;

    _initModule.bind(this)();

  }

  static initModule (elem, config) {
    return new ChiModule(elem, config);
  }

}


let alert = ChiModule.initModule;

export {alert};

import {Component} from "../core/component";
import {Util} from "../core/util.js";

const ANIMATION_DURATION = 500;
const CLASS_ACTIVE = "-active";
const CLASS_ANIMATED = "-animated";
const CLASS_BACKDROP_CLOSED = "-closed";
const CLASS_DRAWER = 'm-drawer';
const CLASS_TRANSITIONING = "-transitioning";
const CLOSE_TRIGGER_SELECTOR = `.${CLASS_DRAWER} > .-close, .${CLASS_DRAWER} > .m-drawer__header > .-close`;
const COMPONENT_SELECTOR = '.m-drawer__trigger';
const COMPONENT_TYPE = "drawer";
const EVENTS = {
  show: 'chi.drawer.show',
  hide: 'chi.drawer.hide'
};
const DEFAULT_CONFIG = {
  target: null,
  animated: true
};

class Drawer extends Component {

  constructor (elem, config) {

    super(elem, Util.extend(DEFAULT_CONFIG, config));
    this._shown = Util.hasClass(elem, CLASS_ACTIVE);
    this._transitioning = false;
    if (this._config.target) {
      if (this._config.target instanceof Element) {
        this._drawerElem = this._config.target;
      } else {
        this._drawerElem = document.querySelector(this._config.target);
      }
    } else {
      this._drawerElem = this._locateDrawer();
    }
    this._closeButton = this._locateCloseButton();
    this._backdrop = this._locateBackdrop();
    this._currentThreeStepsAnimation = null;
    let self = this;

    if (this._config.animated){
      Util.addClass(this._drawerElem, CLASS_ANIMATED);
      if (this._backdrop) {
        Util.addClass(this._backdrop, CLASS_ANIMATED);
      }
    }

    this._triggerClickEventListener = function(e) {
      e.preventDefault();
      self.toggle();
    };
    this._closeClickEventListener = function() {
      self.hide();
    };

    this._elem.addEventListener('click', this._triggerClickEventListener);
    this._closeButton.addEventListener('click', this._closeClickEventListener);
  }

  _locateDrawer () {
    const drawerElem = Util.getTarget(this._elem);
    if (!drawerElem) {
      throw new Error ("Could not find drawer content for drawer trigger. ");
    }
    return drawerElem;
  }
  _locateCloseButton() {
    const closeButtons = this._drawerElem.querySelectorAll(CLOSE_TRIGGER_SELECTOR);
    if (closeButtons) {
      return closeButtons[0];
    } else {
      return null;
    }
  }

  _locateBackdrop() {
    const parent = this._drawerElem.parentNode;
    if (Util.hasClass(parent, 'a-backdrop')) {
      return parent;
    } else {
      return null;
    }
  }

  show() {
    if (!this._shown) {
      if (this._transitioning) {
        Util.stopThreeStepsAnimation(this._currentThreeStepsAnimation, false);
      }
      this._transitioning = true;
      const self = this;
      if (this._config.animated){
        this._currentThreeStepsAnimation = Util.threeStepsAnimation(
          function () {
            Util.addClass(self._drawerElem, CLASS_TRANSITIONING);
            if (self._backdrop) {
              Util.addClass(self._backdrop, CLASS_TRANSITIONING);
            }
          },
          function(){
            Util.addClass(self._drawerElem, CLASS_ACTIVE);
            if (self._backdrop) {
              Util.removeClass(self._backdrop, CLASS_BACKDROP_CLOSED);
            }
            self._shown = true;
            self._drawerElem.dispatchEvent(
              Util.createEvent(EVENTS.show)
            );
          },
          function() {
            Util.addClass(self._elem, CLASS_ACTIVE);
            Util.removeClass(self._drawerElem, CLASS_TRANSITIONING);
            if (self._backdrop) {
              Util.removeClass(self._backdrop, CLASS_TRANSITIONING);
            }
            self._transitioning = false;
          },
          ANIMATION_DURATION
        );
      } else {
        Util.addClass(self._drawerElem, CLASS_ACTIVE);
        Util.addClass(self._elem, CLASS_ACTIVE);
        if (self._backdrop) { Util.removeClass(self._backdrop, CLASS_BACKDROP_CLOSED); }
        self._transitioning = false;
        self._shown = true;
        self._drawerElem.dispatchEvent(
          Util.createEvent(EVENTS.show)
        );
      }
    }
  }

  hide() {
    if (this._shown) {
      if (this._transitioning) {
        Util.stopThreeStepsAnimation(this._currentThreeStepsAnimation, false);
      }
      this._transitioning = true;
      const self = this;
      if (this._config.animated){
        this._currentThreeStepsAnimation = Util.threeStepsAnimation(
          function() {
            Util.addClass(self._drawerElem, CLASS_TRANSITIONING);
            if (self._backdrop) {
              Util.addClass(self._backdrop, CLASS_TRANSITIONING);
            }
          },
          function(){
            Util.removeClass(self._drawerElem, CLASS_ACTIVE);
            if (self._backdrop) {
              Util.addClass(self._backdrop, CLASS_BACKDROP_CLOSED);
            }
            self._shown = false;
            self._drawerElem.dispatchEvent(
              Util.createEvent(EVENTS.hide)
            );
          },
          function() {
            Util.removeClass(self._drawerElem, CLASS_TRANSITIONING);
            Util.removeClass(self._elem, CLASS_ACTIVE);
            if (self._backdrop) {
              Util.removeClass(self._backdrop, CLASS_TRANSITIONING);
            }
            self._transitioning = false;
          },
          ANIMATION_DURATION
        );
      } else {
        Util.removeClass(self._drawerElem, CLASS_ACTIVE);
        Util.removeClass(self._elem, CLASS_ACTIVE);
        if (self._backdrop) { Util.addClass(self._backdrop, CLASS_BACKDROP_CLOSED); }
        self._transitioning = false;
        self._shown = false;
        self._drawerElem.dispatchEvent(
          Util.createEvent(EVENTS.hide)
        );
      }
    }
  }

  toggle () {
    if (this._shown) {
      this.hide();
    } else {
      this.show();
    }
  }

  dispose() {
    this._config = null;
    this._drawerElem = null;
    this._shown = null;
    this._transitioning = null;
    this._elem.removeEventListener('click', this._triggerClickEventListener);
    this._closeButton.removeEventListener('click', this._closeClickEventListener);
    this._closeButton = null;
    this._currentThreeStepsAnimation = null;
    this._elem = null;
  }

  static get componentType () {
    return COMPONENT_TYPE;
  }

  static get componentSelector () {
    return COMPONENT_SELECTOR;
  }

}

const factory = Component.factory.bind(Drawer);
export {Drawer, factory, CLASS_ACTIVE, EVENTS};

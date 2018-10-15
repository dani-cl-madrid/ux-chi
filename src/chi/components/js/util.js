
console.log('util loaded');

export class util {

   static removeClass (elem, className) {
    elem.className = elem.className.split(' ').filter(function (v) {
      return v !== className;
    }).join(' ');
  }

   static addClass (elem, className) {
    elem.className += ' ' + className;
  }

  static hasClass (elem, className) {
    return new RegExp('(\\s|^)' + className + '(\\s|$)').test(elem.className);
  }

  static toggleClass (elem, className) {
    if (hasClass(elem, className)) {
      removeClass(elem, className);
    } else {
      addClass(elem, className);
    }
  }

  static getTarget (element) {

    let selector = element.dataset && element.dataset.target ? element.dataset.target.trim() : '';
    if (!selector) {
      const hrefTarget = element.getAttribute('href');
      selector = hrefTarget ? hrefTarget.trim() : '';
    }

    return selector ? document.querySelector(selector) : null;

  }

  static findAndApply (ancestor, className, callback) {
    if (hasClass(ancestor, className)) {
      callback(ancestor);
    } else if (ancestor.getElementsByClassName) {
      Array.prototype.forEach.call(
        ancestor.getElementsByClassName(className), function (elem) {
          callback(elem);
        }
      );
    }
  }

}

// "use strict";

window.utils = {
  isScrolledViewportHeight: function(scale) {
    if (typeof scale === "undefined") {
      scale = 1;
    }
  
    if (window && window.innerHeight && window.pageYOffset) {
      return window.pageYOffset > window.innerHeight * scale;
    }
  },

  setMultipleAttributes: function(htmlElement, attributesObj) {
    for (var key in attributesObj) {
      htmlElement.setAttribute(key, attributesObj[key]);
    }
  },

  isUndefined: function(elem) {
    return typeof elem === 'undefined';
  },

  parseAlphaNumeric: function(str) {
    return str.replace(/[^0-9A-Z]+/gi,"")
  },

  createElementFromHTML: function(str) {
    var div = document.createElement('div');
    div.innerHTML = str.trim();

    return div.firstElementChild;
  }
}
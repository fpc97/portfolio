"use strict";

(function() {
  var aside = document.getElementsByClassName("aside")[0];

  if (!aside) {
    return;
  }

  aside.classList.remove("scrolled");

  window.addEventListener("scroll", function() {
    if (utils.isScrolledViewportHeight(.89)) {
      aside.classList.add("scrolled");
    } else {
      aside.classList.remove("scrolled");
    }
  });
})();
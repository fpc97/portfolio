"use strict";

(function() {
  var resizeTimer;
  
  window.addEventListener("resize", function() {
    document.body.classList.add("resize-animation-stopper");

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function() {
      document.body.classList.remove("resize-animation-stopper");
    }, 400);
  });
})()
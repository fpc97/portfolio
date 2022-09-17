"use strict";

// Smooth scrolling
(function() {
  if (window.scrollTo && document.querySelectorAll) {
    var anchors = document.querySelectorAll("a[href^='#']");
  
    for (var i = 0; i < anchors.length; i++) {
      (function() {
        var linkedId = anchors[i].getAttribute("href");
        var linkedElement = document.getElementById(linkedId.substring(1));
  
        if (!linkedElement) {
          console.warn('Element with id ' + linkedId + ' not found');
          return
        }
  
        if (linkedElement) {
          anchors[i].addEventListener("click", function(e) {
            e.preventDefault();
  
            if (history.pushState) {
              var id = linkedElement.id;
  
              if (id !== 'home') {
                history.pushState(null, null, '#' + id);
              } else {
                history.replaceState(null, null, ' ');
              }
            }
      
            window.scrollTo({
              top: linkedElement.offsetTop,
              behavior: "smooth"
            });
          });
        }
      })();
    }
  }
})();

// Close nav on section anchor click
(function() {
  var navMobile = document.getElementById('nav-mobile');

  navMobile.addEventListener('click', handleClick);

  function handleClick(e) {
    const attribute = e.target.getAttribute('href')
    if (!(attribute && attribute.startsWith('#'))) {
      return
    }

    document.getElementById('nav-check').checked = false    
  }
})();
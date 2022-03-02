"use strict";

(function addCancelShadowListener() {
  function cancelShadow(e) {
    var animationList = e.target.getAnimations();
  
    for(var i = 0; i < animationList.length; i++) {
      if (animationList[i].transitionProperty === 'box-shadow') {
        animationList[i].cancel();
      }
    }
  }

  var slideButtonList = document.getElementsByClassName('btn-slide');
  
  for(var i = 0; i < slideButtonList.length; i++) {
    slideButtonList[i].addEventListener('mouseout', cancelShadow);
  }
})();
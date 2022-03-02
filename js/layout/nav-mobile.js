"use strict";

(function() {
  var nav = document.getElementById("nav");
  var navMobileContainer = document.getElementById("nav-mobile");
  var aside = document.getElementById("aside");

  var navMobile = nav.cloneNode(true);
  var navMobileLinks = navMobile.getElementsByTagName("a");

  var asideSocialMediaList = aside.getElementsByTagName("ul")[0];
  var socialMediaListCopy = asideSocialMediaList.cloneNode(true);
  socialMediaListCopy.className = "social-media";

  if (navMobileLinks.length) {
    navMobile.removeAttribute("id");
    navMobile.removeAttribute("class");

    for (var i = 0; i < navMobileLinks.length; i++) {
      navMobileLinks[i].removeAttribute("class");
    }
  }

  navMobileContainer.appendChild(navMobile);
  navMobileContainer.appendChild(socialMediaListCopy);
})();
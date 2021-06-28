// Smooth scrolling
if (window.scrollTo && document.querySelectorAll) {
  var anchors = document.querySelectorAll("a[href^='#']");

  for (var i = 0; i < anchors.length; i++) {
    (function() {
      var linkedId = anchors[i].getAttribute("href");
      var linkedElement = document.getElementById(linkedId.substring(1));

      console.log(linkedId, linkedElement)

      if (linkedElement) {
        anchors[i].addEventListener("click", function(e) {
          e.preventDefault();
    
          window.scrollTo({
            top: linkedElement.offsetTop,
            behavior: "smooth"
          });
        });
      }
    })();
  }
}
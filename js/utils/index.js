function isScrolledViewportHeight(scale) {
  if (typeof scale === "undefined") {
    scale = 1;
  }

  if (window && window.innerHeight && window.pageYOffset) {
    return window.pageYOffset > window.innerHeight * scale;
  }
}
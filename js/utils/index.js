function isScrolledViewportHeight() {
  if (window && window.innerHeight && window.pageYOffset) {
    return window.pageYOffset > window.innerHeight;
  }
}
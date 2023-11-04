document.addEventListener("DOMContentLoaded", function() {
  const scrollToMapButton = document.getElementById("scroll-to-map");
  const mapCanvas = document.getElementById("map-canvas");

  scrollToMapButton.addEventListener("click", function() {
    mapCanvas.scrollIntoView({ behavior: "smooth" });
  });
})

// const navigation = document.getElementById("#scroll-to-map");

// const navigationHeight = navigation.offsetHeight;

// document.documentElement.style.setProperty(
//   "--scroll-padding",
//   navigationHeight + "px"
// );
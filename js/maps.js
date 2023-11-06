let map;

let carbonMin = Number.MAX_VALUE,
  carbonMax = -Number.MAX_VALUE;

var regioninuk = "./resources/UK.geojson"



// var eastMidlands = "https://findthatpostcode.uk/areas/E12000004.geojson"

async function initMap() {
  // The location of Uluru
  const position = { lat: 54.6819964, lng: -4.0084773 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  // The map, centered at Uluru
  map = new Map(document.getElementById("map-canvas"), {
    zoom: 6.2,
    center: position,
    styles: carbon
  });

  // Add events for google maps
  //map.data.setStyle(styleFeature);
  map.data.addListener("mouseover", hoverIn);
  map.data.addListener("mouseout", hoverOut);


  //Call function to load polygon boundaries
  loadPolygon();

}

initMap();


// ================== functions to be loaded onto maps ============================= //


//Load the boundaries polygon from Geojson files
function loadPolygon () {
  // Load Geojson files
  map.data.loadGeoJson(regioninuk);
  
  map.data.setStyle({
    strokeWeight: 0.5,
    strokeColor:  "#ffffff"

    });
};







/**
 * Responds to the mouse-in event on a map shape (state).
 *
 * @param {?google.maps.MapMouseEvent} e
 */

function hoverIn(e) {
  // set the hover state
  e.feature.setProperty("state", "hover");
  console.log(e.feature.getProperty("state"));

  // update the styling of the feature 
  map.data.revertStyle();
  map.data.overrideStyle(e.feature, {
    strokeColor: "#ffffff", // white border
    strokeWeight: 2,
    zIndex: 2,
  });

}

function hoverOut(e) {
  //reset the hover state
  e.feature.setProperty("state", "normal");
  map.data.revertStyle();

}




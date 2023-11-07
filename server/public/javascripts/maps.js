let map;

let carbonMin = Number.MAX_VALUE,
  carbonMax = -Number.MAX_VALUE;

var regioninuk = "./resources/UK.geojson"



let hoverFlag = false;
let nameFrom = null;

// var eastMidlands = "https://findthatpostcode.uk/areas/E12000004.geojson"

async function initMap() {
  // The location of Uluru
  const position = { lat: 54.6819964, lng: -8 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  document.body.appendChild(infoElement);
  
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
  map.data.addListener('click', clickFeature);

  //Call function to load polygon boundaries
  loadPolygon();

}


//Load the boundaries polygon from Geojson files
function loadPolygon () {
  // Load Geojson files
  map.data.loadGeoJson(regioninuk);
  
  
  map.data.setStyle({
    strokeWeight: 1,
    
    });
}


// /**
//  * Loads carbon intensity from carbon intensity API
//  *
//  * @param {string} variable
//  */
// function loadCarbonIndex(variable) {
//   // load the variable from API
//   const  = new XMLHttpRequest();

//   xhr.open("GET", variable + ".json");
//   xhr.onload = function () {
//     const censusData = JSON.parse(xhr.responseText);

// }


/**
 * Responds to the mouse-in event on a map shape (state).
 *
 * @param {?google.maps.MapMouseEvent} e
 */


var infoElement = document.getElementById('info');

document.addEventListener('mousemove', function(e) {
  var mouseX = e.clientX;
  var mouseY = e.clientY;
  
  infoElement.style.left = mouseX + 5 + 'px';
  infoElement.style.top = mouseY + 5 + 'px';
});

function hoverIn(e) {
  if (hoverFlag === false){
    // set the hover state
    e.feature.setProperty("state", "hover");
    //display tooltip
    var locationName = e.feature.getProperty('name');
    
    infoElement.innerHTML = locationName;
    infoElement.style.display = 'block';
    map.data.revertStyle();
    map.data.overrideStyle(e.feature, {
      strokeColor: "#ffffff", // white border
      strokeWeight: 1,
      zIndex: 1,
    });
    if(locationName != nameFrom){
      nameFrom = locationName;
      // update the styling of the feature
      
    }
    hoverFlag = true;
  }
}

function hoverOut(e) {
  if (hoverFlag === true){
    hoverFlag = false;
    //reset the hover state
    e.feature.setProperty("state", "normal");
    map.data.overrideStyle(e.feature, {
      strokeColor: "#000000",
      strokeWeight: 1,
      zIndex: 1,
    });
    //hide tooltip
    infoElement.style.display = 'none';
  }
}






function clickFeature(e) {
    // get region name
  var locationName = e.feature.getProperty('name');

  // check there is not same content
  var existingInfoBoxes = document.querySelectorAll('.custom-info-box');
  for (var i = 0; i < existingInfoBoxes.length; i++) {
    var existingLocationName = existingInfoBoxes[i].querySelector('.selected-region-name').textContent;
    if (existingLocationName === locationName) {
      return; 
    }
  }

  // add box to place region name
  var newInfoBox = document.createElement('div');
  newInfoBox.className = 'custom-info-box'; 
  newInfoBox.style.display = 'inline-block'; 
  newInfoBox.style.margin = '5px'; 

  newInfoBox.innerHTML = '<span class="selected-region-name"></span><button class="close-button">x</button>';

  // set region name 
  newInfoBox.querySelector('.selected-region-name').textContent = locationName;

  // link to div which id is custom-container
  var customContainer = document.getElementById('custom-container');
  if (customContainer) {
    
  // add to custom-container div
  customContainer.appendChild(newInfoBox);

  // add close button
  var closeButton = newInfoBox.querySelector('.close-button');

  //close button style
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.outline = 'none';

  closeButton.addEventListener('click', function() {
    newInfoBox.remove(); 
  });
  }
  

  console.log(locationName);
}

initMap();


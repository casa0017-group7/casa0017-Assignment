let map;

let carbonMin = Number.MAX_VALUE,
  carbonMax = -Number.MAX_VALUE;

var regioninuk = "./resources/UK.geojson";
var CarbonApiUrl = "https://api.carbonintensity.org.uk/regional";



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
    styles: carbon,
    disableDefaultUI: true,



  });

  // Add events for google maps
  //map.data.setStyle(styleFeature);
  map.data.addListener("mouseover", hoverIn);
  map.data.addListener("mouseout", hoverOut);



   //Call function to load polygon boundaries
  loadPolygon();
  loadCarbonIndex(CarbonApiUrl);
}

initMap();


// ================== functions to be loaded onto maps ============================= //


//Load the boundaries polygon from Geojson files
function loadPolygon () {
  // Load Geojson files
  map.data.loadGeoJson(regioninuk, 
    { idPropertyName: "code"});
  
  
  map.data.setStyle({
    strokeColor:  "#ffffff",
    strokeWeight: 0.5,
    
    });

  // google.maps.event.addListenerOnce(map.data, "addfeature", ( => {
  //   google.maps.event.trigger(
  //     document.getElementBy
      
  //   )
  // }))  
};


 /**
 * Loads carbon intensity from carbon intensity API
 *
 * @param {string} variable
 */
 function loadCarbonIndex(variable) {
  // load the variable from API
  fetch(variable)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const regions = data.data[0].regions;
      //console.log(regions);
      const regionData = [];
      regions.forEach((region) => {
        const regionInfo = region.regionid;
        const shortName = region.shortName;
        const forecast =  region.intensity.forecast;
    
        //regionData.push(regionInfo);
        console.log(region);
        console.log(region.regionid);

        // calc min and max values
        if (forecast < carbonMin) {
          carbonMin = forecast;
        }

        if (forecast > carbonMax) {
          carbonMax = forecast;
        }
        //console.log(carbonMin);
        //console.log(carbonMax);

        const state = map.data.getFeatureById(regionInfo);
        
        if (state) {
          state.setProperty("carbonIndex", forecast)
        }

        //console.log(state);
        console.log(regionInfo);
      });
  
      //console.log("Region Data ;" , regionData)
    })
    //.catch((error) => console.error("Error:", error));
  
}



function hoverIn(e) {
  // set the hover state
  e.feature.setProperty("state", "hover");
  console.log(e.feature.getProperty("state") + " at region");

  // update the styling of the feature 
  map.data.revertStyle();
  map.data.overrideStyle(e.feature, {
    strokeColor: "#ffffff", // white border
    strokeWeight: 2.5,
    zIndex: 2,

    
  });

}

function hoverOut(e) {
  //reset the hover state
  e.feature.setProperty("state", "normal");
  map.data.revertStyle();

}




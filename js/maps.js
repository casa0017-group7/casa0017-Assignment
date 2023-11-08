let map;

let carbonData = [];
var state = [];
let carbonMin = Number.MAX_VALUE,
  carbonMax = -Number.MAX_VALUE;

var regioninuk = "./resources/UK.geojson";
var CarbonApiUrl = "https://api.carbonintensity.org.uk/regional";



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
    fullscreenControl: true



  });

  // Add events for google maps
  //map.data.setStyle(styleFeature);
  map.data.addListener("mouseover", hoverIn);
  map.data.addListener("mouseout", hoverOut);



   //Call function to load polygon boundaries
  loadPolygon();
  //loadCarbonIndex(CarbonApiUrl);
}

initMap();


// ================== functions to be loaded onto maps ============================= //


//Load the boundaries polygon from Geojson files
function loadPolygon () {
  // Load Geojson files
  map.data.loadGeoJson(regioninuk, 
    { idPropertyName: "name"}, 
    function(features) {
      loadCarbonIndex();
    });
    
    
  
    //console.log(map.data);
  map.data.setStyle({
    strokeColor:  "#ffffff",
    strokeWeight: 0.5,
    
    });
};


 /**
 * Loads carbon intensity from carbon intensity API
 *
 * @param {string} variable
 */
 function loadCarbonIndex() {

fetch(CarbonApiUrl)
  .then(response => {
    return response.json();
  })
  .then(data => {
    if (data && data.data) {
      const regions = data.data[0].regions; // Assuming there's only one region in the response
      //console.log(regions);
      if (regions) {
        const regionData = [];

        regions.forEach(region => {
          //const regionid = region.regionid;
          const name = region.shortname;
          const forecast = region.intensity.forecast;
          const translatedName = translateRegionName(name);
          console.log(name);
          console.log(translatedName); 

          //regionData.push(regionInfo);

          if (forecast < carbonMin) {
            carbonMin = forecast;
          }
          if (forecast > carbonMax) {
            carbonMax = forecast;
          }
          // console.log(carbonMin);
          // console.log(carbonMax);

          state = map.data.getFeatureById(translatedName);
          console.log(state);

          if (state !== undefined) {
            state.setProperty("census_variable", forecast);
            state.setProperty("name", translatedName);
            console.log(state.getProperty("name"));
            console.log(state.getProperty("census_variable"));

          }

        });

        console.log("Region Data (regionid and shortname):", regionData);
      } else {
        console.log("Regions data not found.");
      }
    } else {
      console.log("Data not found in the response.");
    }
  })
  .catch(error => console.error("Error:", error));
  
}



function hoverIn(e) {
  // set the hover state
  e.feature.setProperty("state", "hover");
  console.log(e.feature.getProperty("state") + " at region" + e.feature.getProperty("name") + " with carbon index " + e.feature.getProperty("census_variable"));

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

function translateRegionName(geojsonName) {
  const translations = {
    "North West England": "North West",
    "North East England": "North East",
    "Yorkshire": "Yorkshire and The Humber",
    "South West England": "South West",
    "South East England": "South East",
    // Add more translations as needed
  };

  return translations[geojsonName] || geojsonName;
}



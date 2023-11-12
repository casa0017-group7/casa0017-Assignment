let map;


let carbonData = [];
var state = [];
let carbonMin = Number.MAX_VALUE,
  carbonMax = -Number.MAX_VALUE;

var regioninuk = "./resources/UK.geojson"
var CarbonApiUrl = "https://api.carbonintensity.org.uk/regional";

let hoverFlag = false;
let nameFrom = null;

let regionData = [];

let infowindow;
const { Data, Map, InfoWindow } = await google.maps.importLibrary("maps");


google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawPieChart);

async function initMap() {
  // The location of London
  const position = { lat: 54.55, lng: -4.35 };


  const { Data, Map, InfoWindow } = await google.maps.importLibrary("maps");
  const {LatLngBounds, LatLng} = await google.maps.importLibrary("core")
  //const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

  //document.body.appendChild(infoElement);
  
  var GreatBritain = {
    north: 62.55,
    south: 41.55,
    west: -14.35,
    east: 6.35,
  };

  // The map, centered at UK
  map = new google.maps.Map(document.getElementById("map-canvas"), {
    restriction: {
      latLngBounds: GreatBritain,
      strictBounds: false,

    },
    zoom: 6,
    center: position,
    styles: carbon,
    fullscreenControl: true,
    scaleControl: true,
    mapTypeControl: false,
    streetViewControl: false,

  });

  infowindow = new google.maps.InfoWindow({maxWidth: 600});


  // Add events for google maps
  map.data.setStyle(setFeatureStyle);
  map.data.addListener("mouseover", hoverIn);
  map.data.addListener("mouseout", hoverOut);
  map.data.addListener('click', clickFeature);


  //Call function to load polygon boundaries
  loadPolygon();


}
initMap();

// ================== functions to be loaded onto maps ============================= //

//Load the boundaries polygon from Geojson files
function loadPolygon () {
  // Load Geojson files
  var mapps = map.data.loadGeoJson(regioninuk, 
    { idPropertyName: "name"}, 
    function(features) {
      loadCarbonIndex(CarbonApiUrl);
     })
};


//* Loads carbon intensity from carbon intensity API
function loadCarbonIndex(variable) {
  fetch(variable)
    .then(response => {
      return response.json();
    })
    .then(data => {
      if (data && data.data) {
        const regions = data.data[0].regions; // Assuming there's only one region in the response
        //console.log(regions);
        if (regions) {

          regions.forEach(region => {
            const regionid = region.regionid;
            const name = region.shortname;
            const time = new Date(data.data[0].from);
            const date = time.toISOString().split('T')[0];
            const curTime = formatTime(time);
            console.log(curTime);

            const toTime = region.to;
            const forecast = region.intensity.forecast;
            const translatedName = translateRegionName(name);
            //console.log(name);
            //console.log(currentTime); 
            const generationmix = region.generationmix;
 
             if (forecast < carbonMin) {
              carbonMin = forecast;
            }
            if (forecast > carbonMax) {
              carbonMax = forecast;
            }
              
            state = map.data.getFeatureById(translatedName);
            console.log(state);
  
            if (state !== undefined) {
              state.setProperty("carbonIndex", forecast);
              state.setProperty("regionid", regionid);
              state.setProperty("name", name);
              state.setProperty("translatedName", translatedName);
              state.setProperty("date", date);
              state.setProperty("curTime", curTime);
              state.setProperty("generationmix", generationmix);
                
            }
            // update labels
            document.getElementById("carbonmin").textContent =
            carbonMin.toLocaleString();
            document.getElementById("carbonmax").textContent =
            carbonMax.toLocaleString();
          });
  
          //console.log("Region Data (regionid and shortname):", regionData);
        } else {
          console.log("Regions data not found.");
        }
      } else {
        console.log("Data not found in the response.");
      }
    })
    .catch(error => console.error("Error:", error));
    
  }
  
// Apply style for gradient color
function setFeatureStyle(feature) {
  // Define the low and high colors
  const lowColor = [246,239,247]; // RGB for low value
  const highColor = [2,129,138];   // RGB for high value

  // Access the carbonIndex from the feature properties
  const carbonIndex = feature.getProperty("carbonIndex");

  // Calculate the interpolation factor based on the carbonIndex
  const factor = (carbonIndex - carbonMin) / (carbonMax - carbonMin);

  // Interpolate the color
  const interpolate = interpolateColor(lowColor, highColor, factor);

  return {
    strokeWeight: 0.5,
    strokeColor: "#2a2a2a",
    fillColor: `rgb(${interpolate[0]}, ${interpolate[1]}, ${interpolate[2]})`,
    fillOpacity: 1,
  };
}

// Function to interpolate color based on a factor
function interpolateColor(color1, color2, factor) {
  const result = [];
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(color1[i] + (color2[i] - color1[i]) * factor);
  }
  return result;
}

//Effect when hover in
function hoverIn(e) {
    // set the hover state
    e.feature.setProperty("state", "hover");
    //console.log(e.feature.getProperty("state") + " at region " + e.feature.getProperty("translatedName") + " with carbon index " + e.feature.getProperty("carbonIndex"));

    const percent =
    ((e.feature.getProperty("carbonIndex") - carbonMin) /
      (carbonMax - carbonMin)) *
    100;
  
    document.getElementById("data-caret").style.display = "block";
    document.getElementById("data-caret").style.paddingLeft = percent + "%";

    // Call the getCenterPolygon function
    const center = getCenterPolygon(e.feature);
    
  // Create and draw the Pie Chart
  //infowindow = new google.maps.InfoWindow();
  //infowindow.setContent(infoWindowed(center, map, e.feature));
  infowindow.setContent(drawPieChart(center, map, e.feature));
  infowindow.setPosition(center);

    
    map.data.revertStyle();
    map.data.overrideStyle(e.feature, {
      strokeColor: "#ffffff", // white border
      strokeWeight: 2.5,
      zIndex: 2,
    });

  }


// Hover out
function hoverOut(e) {
    //reset the hover state
    e.feature.setProperty("state", "normal");
    map.data.revertStyle();
    //infowindow = new google.maps.InfoWindow();
    infowindow.close();
}

var infoElement = document.getElementById('info');

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
  newInfoBox.style.backgroundcolor='#111111'; 

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

//Translate region name from geojson to maps
function translateRegionName(geojsonName) {
  const translations = {
    "North West England": "North West",
    "North East England": "North East",
    "Yorkshire": "Yorkshire and The Humber",
    "South West England": "South West",
    "South East England": "South East",
    "East England" : "East of England",

  };

  return translations[geojsonName] || geojsonName;
}

// Get the center of polygon
function getCenterPolygon(feature) {
  // Create an empty bounds object
  var bounds = new google.maps.LatLngBounds();

  // Loop through the coordinates of the feature's geometry
  feature.getGeometry().forEachLatLng(function(LatLng) {
    bounds.extend(LatLng);
  });

  // Return the center of the bounds
  return bounds.getCenter();
}

//Draw Pie Chart
function drawPieChart(marker, map, data) {
  var generationMix = data.getProperty("generationmix");
  var name = data.getProperty("name");
  var dateTime = data.getProperty("curTime");
console.log(dateTime);
  var data = new google.visualization.DataTable(generationMix);
  data.addColumn('string', 'Fuel');
  data.addColumn('number', 'Percent');

  // Add data rows to the DataTable
  for (var i = 0; i < generationMix.length; i++) {
    data.addRow([generationMix[i].fuel, generationMix[i].perc]);
  }

  //console.log(data);
  // Set chart options
  var options = {
    'chartArea': {
      width: '70%',
      height: '70%'
    },
    'width': 430,
    'height': 200,
    'fontSize': 15,
    pieHole: 0.4,
    animation: {
      duration: 1000,
      easing: 'out',
    },
  };

  var node = document.createElement("div");
  var chart = new google.visualization.PieChart(node);
  chart.draw(data, options);


  const contentString =
  '<div id="content">' +
  '<h1 id="firstHeading" class="firstHeading">' + name + '</h1>' +
  '<p>Info Time : '+ dateTime +' - Valid for next 30 Minutes</p><br />' +
  '<p>Open Sidebar for more information</p>'
  "</div>";



  var boxInfo = document.createElement("div");
  boxInfo.innerHTML = contentString;
  boxInfo.appendChild(node);
  // Create a div element to hold the chart

  infowindow = new google.maps.InfoWindow();

  
  infowindow = new google.maps.InfoWindow({
    content: boxInfo
  });
    infowindow.open(map, marker);
}

//Format time to HH:MM:SS
function formatTime(date) {
  var dateObject = date;

  var hours = ('0' + dateObject.getHours()).slice(-2);
  var minutes = ('0' + dateObject.getMinutes()).slice(-2);
  var seconds = ('0' + dateObject.getSeconds()).slice(-2);

  var formattedTime = hours + ':' + minutes + ':' + seconds;

  //console.log(formattedTime); // Output: "07:22:13"
  return hours + ':' + minutes + ':' + seconds;
}

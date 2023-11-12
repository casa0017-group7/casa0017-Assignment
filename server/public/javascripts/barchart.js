$(document).ready(function () {
  var id, shortname, formattedDate, formattedTime;

  $("#dropdown").change(function(){
    id = $(this).val();
    shortname = $("#dropdown :selected").text();
  });
  $('#datetimepicker').datetimepicker({

    defaultDate:0,
    step:30,
    minDate:'2020/01/01',
    maxDate:0,
    maxTime:0  
}).change(function(){
    var startDate = $(this).val();
    var dateObject = new Date(startDate);
    formattedDate = dateObject.toISOString().split('T')[0];
    formattedTime= dateObject.toLocaleTimeString('en-US', { hour12: false });

    // console.log('Formatted Date:', formattedDate);
    // console.log('Formatted Time:', formattedTime);
  });
  $("#submit").click(function () {
    //console.log('ID:', id, 'Shortname:', shortname, 'date:', formattedDate, 'time:', formattedTime);
    const requestData = {
          regionid: id,
          shortname: shortname,
          date: formattedDate,
          time: formattedTime
    };
    const jsonData = JSON.stringify(requestData);
    console.log(jsonData);
  
    const url = "http://localhost:3000/map/data";

    // Make the POST request using fetch
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: jsonData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Handle the response data
        console.log(data);
      })
      .catch(error => {
        // Handle errors during the request
        console.error('Error:', error);

  });
});
})






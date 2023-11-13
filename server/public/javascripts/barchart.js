$(document).ready(function () {
  var id, shortname, formattedDate, formattedTime;
  var dataArray;

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
    //console.log(requestData);
  
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
        //console.log(data);
      dataArray = JSON.parse(data[0].data);  
      //console.log(dataArray);
      drawBarChart(dataArray);
      })
      .catch(error => {
        // Handle errors during the request
        console.error('Error:', error);

  });
});
})
google.charts.load('current', {'packages':['bar']});
google.charts.setOnLoadCallback(drawBarChart);

function drawBarChart(data) {
  var chartData = data;
  var dataTable = new google.visualization.DataTable(chartData);
  dataTable.addColumn('string', 'Fuel');
  dataTable.addColumn('number', 'Percent');

  for (var i = 0; i < chartData.length; i++) {
    dataTable.addRow([chartData[i].fuel, chartData[i].perc]);
  }
  var options = {
    title: 'Fuel Percentage',
    chartArea: { width: '50%' },
    hAxis: {
      title: 'Percentage',
      minValue: 0,
      maxValue: 100
    },
    vAxis: {
      title: 'Fuel'
    }
  };

  var chart = new google.charts.Bar(document.getElementById('barchart_material'));
  chart.draw(dataTable, google.charts.Bar.convertOptions(options));
  //console.log(chart);
}





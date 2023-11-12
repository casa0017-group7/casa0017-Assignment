function drawChart(marker) {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Mushrooms', 3],
      ['Onions', 1],
      ['Olives', 1],
      ['Zucchini', 1],
      ['Pepperoni', 2]
    ]);

    // Set chart options
    var options = {'title':'Pizza sold @ '+
                           marker.getPosition().toString(),
                   'width':400,
                   'height':150};
                   
    var node        = document.createElement('div'),
        infoWindow  = new google.maps.InfoWindow(),
        chart       = new google.visualization.PieChart(node);
        
        chart.draw(data, options);
        infoWindow.setContent(node);
        infoWindow.open(marker.getMap(),marker);
  }
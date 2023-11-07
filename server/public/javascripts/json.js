fetch('http://localhost:3000/resources/UK.geojson')
    .then(response => response.json())
    .then(data => {
      data.features.forEach(feature => {
        // 访问属性并将其打印到控制台
        console.log('name:', feature.properties.name);
      });
    });
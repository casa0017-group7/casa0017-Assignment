# Carbon Intensity Monitoring Web Application
## Usage Instructions

1. Clone the repository:

   ```
   git clone https://github.com/casa0017-group7/casa0017-Assignment.git
   ```

   

2. Deploy the server in local:

   ```
   node server/bin/www.js
   ```

3. Open http://localhost:8898 in your browser

   or access the link we have deployed on the server: http://casa0017.cetools.org:8898
   
## Directory structure

```
└─server 					Project main folder
    ├─bin					Project startup file/entry
    ├─node_modules		Project dependency
    ├─public				Static resource directory
    │  ├─apidoc			Apidoc directory
    │  ├─images			Image directory
    │  ├─javascripts		Javascript directory
    │  ├─resources		Other resources
    │  └─stylesheets		css files directory
    ├─routes				Web routing configuration file
    └─views					Html files directory
```

## Front-end Dependencies

This section provides an analysis of the JavaScript and CSS used in the provided HTML page. The analysis is organized into two sections: JavaScript and CSS.

### JavaScript

#### External Libraries and Scripts

```html
<!--google charts-->
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>

<!-- javascript file -->
<script type="module" src="/javascripts/maps.js"></script>
<script type="text/javascript" src="/javascripts/mapstyle.js"></script>
```

- **Google Charts Library**: The page includes the Google Charts library for rendering charts.
- **Custom JavaScript Files**: Two custom JavaScript files, `maps.js` and `mapstyle.js`, are included for handling map functionality.

#### jQuery and jQuery Datetime Picker

```html
<!--Jquery-->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="./javascripts/jquery.js"></script>

<!-- jquery datetime -->
<script type="text/javascript" src="./javascripts/jquery.datetimepicker.full.min.js"></script>
```

- **jQuery Library**: The jQuery library is included for simplified DOM manipulation and event handling.
- **jQuery Datetime Picker**: A jQuery-based datetime picker library is included for handling date and time inputs.

#### Bootstrap CSS & Icon CSS and JavaScript

```html
<!--bootstrap.css-->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

<!--bootstrap-icon.css-->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">

<!--bootstrap.js-->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
```

- **Bootstrap CSS**: The Bootstrap CSS file is included for styling the page.
- **Bootstrap JavaScript**: The Bootstrap JavaScript bundle is included for interactive components such as collapsible navigation.

#### Google Maps API

```html
<script>
  (g => {
    // ... (Google Maps API loading script)
  })({
    key: "sensor",
    v: "weekly"
  });
</script>
```

- **Google Maps API Loading Script**: A script is included to dynamically load the Google Maps API with the provided API key.

#### Custom Chart Scripts

```html
<!-- barchart -->
<script type="text/javascript" src="./javascripts/barchart.js"></script>
```

- **Custom Chart Script**: A custom JavaScript file (`barchart.js`) is included for handling specific chart functionality.

### CSS

#### External Stylesheets

```html
<!--css-->
<link rel='stylesheet' href='/stylesheets/style.css' type='text/css'/>

<!-- Jquery css -->
<link rel='stylesheet' href='/stylesheets/jquery.datetimepicker.css' type='text/css'/>
```

- **Custom Stylesheet**: The page includes a custom stylesheet (`style.css`) for additional styling.
- **jQuery Datetime Picker CSS**: The CSS file for styling the jQuery datetime picker is included.


### ------ insert here for other code -------


### Additional Features

- **Date and Region Selection:** Users can select specific dates and regions to view historical carbon intensity data.
- **Energy Type Percentage Charts:** Interactive bar and line charts display energy type percentages for the selected region and date range.



**Note:** Ensure an active internet connection to load external libraries and data.

Feel free to customize and extend this template for your specific application needs.

For more information and updates, refer to the official documentation or contact the project contributors.

## API

You can find apidoc after deploy at http://localhost:8898/apidoc

## Trouble Shooter

<b>1. Error: Cannot find module '../secrets.js' </b>

Files to store the database host, user name, and password are missing

<b>2. Error: Cannot find module 'mysql' </b>

install mysql module in /server directory

```
npm install mysql
```


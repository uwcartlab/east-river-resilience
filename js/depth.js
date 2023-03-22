require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/ImageryTileLayer"
  ], function (esriConfig, Map, MapView, ImageryTileLayer) {

    let parameters;

    //Set the API key
    esriConfig.apiKey = "AAPK539d9a98e214453db04a93dfaea676adrxOVh3ZE6LGf-_99lThjFmfwvhD2YHTXoC2px7zOQ0x8qZ9nwvwoeuZn0PgmFA_f"

    //Set up the basemap
    const map = new Map({
        basemap: "arcgis-topographic",
    });

    //Set up the Map View
    const view = new MapView({
        container: "viewDiv",
        map: map,
        extent: {
            xmin: -88.4407865369763,
            ymin: 44.2519512604157,
            xmax: -87.57033074655209,
            ymax: 44.58559644055305,
            spatialReference: 4326
        }
    });

    const identifyURL = "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_100_year_high/ImageServer"

    let depth_hundred_year_high = new ImageryTileLayer({
        url: identifyURL,
        title: "Depth 100-year flood"
    });

    map.add(depth_hundred_year_high);

    view.on("click", (event) => {
      depth_hundred_year_high.identify(event.mapPoint)
      .then((results) => {
        console.log("values: ", results.value)
      })
        .catch((err) => console.log(err));
      });

    /*
    view.when(function() {
        // executeIdentify() is called each time the view is clicked
        view.on("click", executeIdentify);

        // Set the parameters for the identify
        params = new IdentifyParameters();
        params.tolerance = 3;
        params.layerIds = [0, 1, 2, 3, 4];
        params.layerOption = "top";
        params.width = view.width;
        params.height = view.height;
      });

       // Executes each time the view is clicked
       function executeIdentify(event) {
        // Set the geometry to the location of the view click
        params.geometry = event.mapPoint;
        params.mapExtent = view.extent;
        document.getElementById("viewDiv").style.cursor = "wait";
       

        // This function returns a promise that resolves to an array of features
        // A custom popupTemplate is set for each feature based on the layer it
        // originates from
        identify.identify(identifyURL, params).then(function(response) {
        const results = response.results;
        console.log(results)
        return results.map(function(result) {
            let feature = result.feature;
            let layerName = result.layerName;

            feature.attributes.layerName = layerName;
            return feature;
        });
      })
    
      .then(showPopup); // Send the array of features to showPopup()

        // Shows the results of the identify in a popup once the promise is resolved
        function showPopup(response) {
        if (response.length > 0) {
            view.popup.open({
            features: response,
            location: event.mapPoint
            });
        }
        document.getElementById("viewDiv").style.cursor = "auto";
        }
       }
        */

});
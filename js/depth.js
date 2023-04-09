require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/layers/ImageryTileLayer"
  ], function (esriConfig, Map, MapView, FeatureLayer, ImageryTileLayer) {

    const imagePopupTemplate = {
      // autocasts as new PopupTemplate()
      title: "Flood Depth",
      fieldInfos: [{
        fieldName: 'Raster.ServicePixelValue',
        format: {
          places: 1
        }
      }],
      content: `
        {Raster.ServicePixelValue} feet
        `
    };

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
        title: "Depth 100-year flood",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        opacity: 0
    });

    let one_hundred_year_high = new FeatureLayer({
      url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_high_lake_level/FeatureServer/0",
      title: "100-year flood",
      visible: true,
      opacity: 0.75
    });

    map.add(depth_hundred_year_high);
    map.add(one_hundred_year_high);

    view.on("click", (event) => {
      depth_hundred_year_high.identify(event.mapPoint)
      .then((results) => {
        console.log("values: ", results.value)
      })
        .catch((err) => console.log(err));
      });
});
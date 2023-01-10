require([
    "esri/config",
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/views/MapView"
], function (esriConfig, Map, MapView, FeatureLayer) {

    //Setting the API key
    esriConfig.apiKey = "AAPK539d9a98e214453db04a93dfaea676adrxOVh3ZE6LGf-_99lThjFmfwvhD2YHTXoC2px7zOQ0x8qZ9nwvwoeuZn0PgmFA_f"

    const map = new Map({
        basemap: "arcgis-topographic"
    });

    const view = new MapView({
        container: "viewDiv",
        map: map,
        extent: {
            xmin: -88.4407865369763,
            ymin: 44.2519512604157,
            xmax: -87.57033074655209,
            ymax: 44.58559644055305,
            spatialReference: 4326
        },
    });

    let one_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/ArcGIS/rest/services/1_year_high_lake_level/FeatureServer/13"
    });

    map.add(one_year_high);

});
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/Basemap",
    "esri/widgets/BasemapGallery",
    "esri/widgets/LayerList",
    "esri/widgets/Swipe",
    "esri/core/Collection",
    "esri/widgets/LayerList/ListItem"

], function (esriConfig, Map, MapView, FeatureLayer, Basemap, BasemapGallery, LayerList, Swipe, Collection, ListItem) {

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

    //Set up the map layers
    //High Lake Level
    let one_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_high_lake_level/FeatureServer/13",
        title: "1-year flood",
        visible: false
    });
    let ten_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map1/FeatureServer/0",
        title: "10-year flood",
        visible: false
    });

    let one_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_high_lake_level/FeatureServer/0",
        title: "100-year flood",
        visible: false
    });

    let five_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_high_lake_level/FeatureServer/0",
        title: "500-year flood",
        visible: false
    });


    let one_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_high_lake_level/FeatureServer/13",
        title: "1-year flood",
        visible: false
    });
    let ten_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map1/FeatureServer/0",
        title: "10-year flood",
        visible: false
    });

    let one_hundred_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_high_lake_level/FeatureServer/0",
        title: "100-year flood",
        visible: false
    });

    let five_hundred_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_high_lake_level/FeatureServer/0",
        title: "500-year flood",
        visible: false
    });

    //add all layers to the map
    map.add(one_year_high)
    map.add(ten_year_high)
    map.add(one_hundred_year_high)
    map.add(five_hundred_year_high)

    map.add(one_year_high_trailing)
    map.add(ten_year_high_trailing)
    map.add(one_hundred_year_high_trailing)
    map.add(five_hundred_year_high_trailing)

    let collection1 = new Collection()
    let collection2 = new Collection()

    let listItem1 = new ListItem({layer: one_year_high})
    let listItem2 = new ListItem({layer: ten_year_high})
    let listItem3 = new ListItem({layer: one_hundred_year_high})
    let listItem4 = new ListItem({layer: five_hundred_year_high})
    let listItem5 = new ListItem({layer: one_year_high_trailing})
    let listItem6 = new ListItem({layer: ten_year_high_trailing})
    let listItem7 = new ListItem({layer: one_hundred_year_high_trailing})
    let listItem8 = new ListItem({layer: five_hundred_year_high_trailing})

    collection1.addMany([listItem1, listItem2, listItem3, listItem4])
    collection2.addMany([listItem5, listItem6, listItem7, listItem8])

    //make two layer lists
    let lList = new LayerList({
        operationalItems: collection1
    });
    let rList = new LayerList({
        operationalItems: collection2
    });  
      
    view.ui.add(lList, "bottom-left");   

    view.ui.add(rList, "bottom-right");

    //Basemap layers for gallery widget
    let arcgisTopo = Basemap.fromId("arcgis-topographic")
    let arcgisImagery = Basemap.fromId("arcgis-imagery-standard")
    let arcgisHybrid = Basemap.fromId("arcgis-imagery")

    //Set up the basemap gallery widget
    const basemapGallery = new BasemapGallery({
        view: view,
        source: [arcgisTopo, arcgisImagery, arcgisHybrid]
      });

    // Add the widget to the top-right corner of the view
    view.ui.add(basemapGallery, {
    position: "top-right"
    });

    // create a new Swipe widget
    const swipe = new Swipe({
        leadingLayers: [one_year_high, ten_year_high, one_hundred_year_high, five_hundred_year_high],
        trailingLayers: [one_year_high_trailing, ten_year_high_trailing, one_hundred_year_high_trailing, five_hundred_year_high_trailing],
        position: 50,
        view: view
        });

        // add the widget to the view
        view.ui.add(swipe);
});
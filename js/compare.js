require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/Basemap",
    "esri/widgets/BasemapGallery",
    "esri/widgets/LayerList",
    "esri/layers/ImageryTileLayer",
    "esri/core/Collection",
    "esri/widgets/LayerList/ListItem",
    "esri/widgets/Print"

], function (esriConfig, Map, MapView, FeatureLayer, Basemap, BasemapGallery, LayerList, ImageryTileLayer, Collection, ListItem, Print) {

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

    const layerRenderer = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            style: "none",
            outline: {
                style: "solid",
                width: "1"
            }
        }
    }

    //Set up the map layers
    //High Lake Level
    let one_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_high_lake_level/FeatureServer/13",
        title: "1-year flood",
        visible: false,
        opacity: 0.6
    });
    let ten_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map1/FeatureServer/0",
        title: "10-year flood",
        visible: false,
        opacity: 0.6
    });

    let one_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_high_lake_level/FeatureServer/0",
        title: "100-year flood",
        visible: false,
        opacity: 0.6
    });

    let five_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_high_lake_level/FeatureServer/0",
        title: "500-year flood",
        visible: false,
        opacity: 0.6
    });


    let one_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_high_lake_level/FeatureServer/13",
        title: "1-year flood",
        renderer: layerRenderer,
        visible: false
    });
    let ten_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map1/FeatureServer/0",
        title: "10-year flood",
        renderer: layerRenderer,
        visible: false
    });

    let one_hundred_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_high_lake_level/FeatureServer/0",
        title: "100-year flood",
        renderer: layerRenderer,
        visible: false
    });

    let five_hundred_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_high_lake_level/FeatureServer/0",
        title: "500-year flood",
        renderer: layerRenderer,
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
        operationalItems: collection1,
        selectionEnabled: true,
        multipleSelectionEnabled: false
    });
    let rList = new LayerList({
        operationalItems: collection2,
        selectionEnabled: true,
        multipleSelectionEnabled: false
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

    const print = new Print({
        view: view,
        // specify your own print service
        printServiceUrl:
           "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
      });      

    view.ui.add(print, {
        position: "top-right"
      });

    //DEPTH QUERY
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

    let depth_hundred_year_high = new ImageryTileLayer({
    url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_100_year_high/ImageServer",
    title: "Depth 100-year flood",
    popupEnabled: true,
    popupTemplate: imagePopupTemplate,
    opacity: 0
    });  

    view.on("click", (event) => {
        if (one_hundred_year_high.visible === true){
            map.add(depth_hundred_year_high)
        } else {
            map.remove(depth_hundred_year_high)
        }
    })
});
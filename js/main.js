require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/Basemap",
    "esri/widgets/BasemapGallery",
    "esri/layers/GroupLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Slider"

], function (esriConfig, Map, MapView, FeatureLayer, Basemap, BasemapGallery, GroupLayer, LayerList, Slider) {

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
        title: "1-year flood"
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
    //Low Lake Level
    let one_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_low_lake_level/FeatureServer/0",
        title: "1-year flood",
        visible: false
    });

    let one_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_lake_level_low/FeatureServer/0",
        title: "100-year flood",
        visible: false
    });

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

    //Create group layer for high lake level layers
    const HighGroupLayer = new GroupLayer({
        title: "High Lake Level",
        visible: true,
        visibilityMode: "exclusive",
        layers: [one_year_high, ten_year_high, one_hundred_year_high, five_hundred_year_high],
        opacity: 0.75
    });
    //Create group layer for low lake level layers
    const LowGroupLayer = new GroupLayer({
        title: "Low Lake Level",
        visible: true,
        visibilityMode: "exclusive",
        layers: [one_year_low, one_hundred_year_low],
        opacity: 0.75
    });
    //Create group layer for all layers
    const LayerGroupLayer = new GroupLayer({
        title: "Layers",
        visible: true,
        visibilityMode: "exclusive",
        layers: [HighGroupLayer, LowGroupLayer],
        opacity: 0.75
    });

    map.add(LayerGroupLayer);

    //Creates actions in the LayerList.
    async function defineActions(event) {
        // The event object contains an item property.
        // is is a ListItem referencing the associated layer
        // and other properties. You can control the visibility of the
        // item, its title, and actions using this object.

        const item = event.item;

        await item.layer.when();

        if (item.title === "Layers") {
            // An array of objects defining actions to place in the LayerList.
            // By making this array two-dimensional, you can separate similar
            // actions into separate groups with a breaking line.

            item.actionsSections = [
            [
                {
                title: "Go to full extent",
                className: "esri-icon-zoom-out-fixed",
                id: "full-extent"
                },
                {
                title: "Layer information",
                className: "esri-icon-description",
                id: "information"
                }
            ],
            [
                {
                title: "Increase opacity",
                className: "esri-icon-up",
                id: "increase-opacity"
                },
                {
                title: "Decrease opacity",
                className: "esri-icon-down",
                id: "decrease-opacity"
                }
            ]
            ];
        }

        // Adds a slider for updating a group layer's opacity
        if (item.children.length > 1 && item.parent) {
            const slider = new Slider({
            min: 0,
            max: 1,
            precision: 2,
            values: [1],
            visibleElements: {
                labels: true,
                rangeLabels: true
            }
            });

            item.panel = {
            content: slider,
            className: "esri-icon-sliders-horizontal",
            title: "Change layer opacity"
            };

            slider.on("thumb-drag", (event) => {
            const { value } = event;
            item.layer.opacity = value;
            });
        }
        }

        view.when(() => {
        // Create the LayerList widget with the associated actions
        // and add it to the top-right corner of the view.

        const layerList = new LayerList({
            view: view,
            // executes for each ListItem in the LayerList
            listItemCreatedFunction: defineActions
        });

        // Event listener that fires each time an action is triggered

        layerList.on("trigger-action", (event) => {
            // The layer visible in the view at the time of the trigger.
            const visibleLayer = one_year_high.visible ? one_year_high : ten_year_high;

            // Capture the action id.
            const id = event.action.id;

            if (id === "full-extent") {
            // if the full-extent action is triggered then navigate
            // to the full extent of the visible layer
            view.goTo(visibleLayer.fullExtent).catch((error) => {
                if (error.name != "AbortError") {
                console.error(error);
                }
            });
            } else if (id === "information") {
            // if the information action is triggered, then
            // open the item details page of the service layer
            window.open(visibleLayer.url);
            } else if (id === "increase-opacity") {
            // if the increase-opacity action is triggered, then
            // increase the opacity of the GroupLayer by 0.25

            if (LayerGroupLayer.opacity < 1) {
                LayerGroupLayer.opacity += 0.25;
            }
            } else if (id === "decrease-opacity") {
            // if the decrease-opacity action is triggered, then
            // decrease the opacity of the GroupLayer by 0.25

            if (LayerGroupLayer.opacity > 0) {
                LayerGroupLayer.opacity -= 0.25;
            }
            }
        });

        // Add widget to the top right corner of the view
        view.ui.add(layerList, "top-right");
        });
});
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GroupLayer",
    "esri/layers/FeatureLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Slider"
], (esriConfig, Map, MapView, GroupLayer, FeatureLayer, LayerList, Slider) => {

    esriConfig.apiKey = "AAPK539d9a98e214453db04a93dfaea676adrxOVh3ZE6LGf-_99lThjFmfwvhD2YHTXoC2px7zOQ0x8qZ9nwvwoeuZn0PgmFA_f"

    //global variables
    let checkedLine = null;

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
    let one_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_high_lake_level/FeatureServer/13",
        title: "1-year flood line",
        renderer: layerRenderer,
        listMode: "hide",
        visible: true
    });
    let ten_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map1/FeatureServer/0",
        title: "10-year flood line",
        renderer: layerRenderer,
        listMode: "hide",
        visible: true
    });

    const floodGroup = new GroupLayer({
        title: "Flood Layers",
        visible: true,
        visibilityMode: "exclusive",
        layers: [one_year_high, ten_year_high],
        opacity: 0.75
    });

    const map = new Map({
        basemap: "arcgis-topographic",
        layers: [floodGroup]
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

    async function defineActions(event) {
        // The event object contains an item property.
        // is is a ListItem referencing the associated layer
        // and other properties. You can control the visibility of the
        // item, its title, and actions using this object.

        const item = event.item;

        await item.layer.when();

        if (item.title != "Flood Layers") {
            // An array of objects defining actions to place in the LayerList.
            // By making this array two-dimensional, you can separate similar
            // actions into separate groups with a breaking line.
            item.actionsSections = [
                [
                    {
                        title: item.title + "_line",
                        className: "esri-icon-radio-unchecked",
                        id: "information"
                    }
                ]
            ];
        }
        else {
            item.actionsSections = [
                [
                    {
                        title: "Outline",
                        className: "outline",
                        id: "title"
                    }
                ]
            ];
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

        //document.querySelector(".outline").innerHTML = "Outline";
        // Event listener that fires each time an action is triggered

        layerList.on("trigger-action", (event) => {
            // The layer visible in the view at the time of the trigger.
            const visibleLayer = one_year_high.visible ? one_year_high : ten_year_high;

            // Capture the action id.
            const id = event.action.id;

            if (id === "information") {
                if (checkedLine) {
                    checkedLine.className = "esri-icon-radio-unchecked"
                }
                checkedLine = event.action

                checkedLine.className = "esri-icon-radio-checked"
                //test adding line layer
                if (one_year_high_trailing.visible)
                    map.remove(one_year_high_trailing)
                if (ten_year_high_trailing.visible)
                    map.remove(ten_year_high_trailing)

                if (event.item.title == "1-year flood")
                    map.add(one_year_high_trailing)
                if (event.item.title == "10-year flood")
                    map.add(ten_year_high_trailing)

            }
        });
        // Add widget to the top right corner of the view
        view.ui.add(layerList, "top-right");
    }).then(function () {
        //function to wait until the layer widget has finished loading in order to add html 
        waitForElementToDisplay(".outline", 1000, 9000);

        function waitForElementToDisplay(selector,  checkFrequencyInMs, timeoutInMs) {
            var startTimeInMs = Date.now();
            (function loopSearch() {
                //check for existence of element
                //if exists, populate HTML and end the function
                if (document.querySelector(selector) != null) {
                    document.querySelector(selector).innerHTML = "Outline";
                    return;
                }
                //if the element doesn't exist, continue running the loop
                else {
                    setTimeout(function () {
                        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                            return;
                        loopSearch();
                    }, checkFrequencyInMs);
                }
            })();
        }

    })
})
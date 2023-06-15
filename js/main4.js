require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/GroupLayer",
    "esri/layers/FeatureLayer",
    "esri/Basemap",
    "esri/widgets/BasemapGallery",
    "esri/widgets/LayerList",
    "esri/layers/ImageryTileLayer",
    "esri/core/Collection",
    "esri/widgets/LayerList/ListItem",
    "esri/widgets/Print",
    "esri/rest/support/AlgorithmicColorRamp"

], function (esriConfig, Map, MapView, GroupLayer, FeatureLayer, Basemap, BasemapGallery, LayerList, ImageryTileLayer, Print,AlgorithmicColorRamp) {
//////GLOBAL VARIABLES////////
    //Set the API key
    esriConfig.apiKey = "AAPK539d9a98e214453db04a93dfaea676adrxOVh3ZE6LGf-_99lThjFmfwvhD2YHTXoC2px7zOQ0x8qZ9nwvwoeuZn0PgmFA_f"

    let checkedLine = null,
        lakeLevel = "high"

//////LAYER RENDERERS///////
    //polygon style
    const polygonStyle = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color:[0, 68, 204, 0.6],
            outline: {
                style: "solid",
                width: "1",
                color: "blue"
            }
        }
    }
    //line style
    const lineStyle = {
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
    //raster depth renderer
    const rasterRenderer = {
        type: "raster-stretch",
        colorRamp: {
            type:"algorithmic",
            algorithm: 'lab-lch',
            toColor: "#0000cc",
            fromColor: "#ccccff"
        },
        stretchType: 'min-max',
        statistics: [{
            min: 1,
            max: 10 
        }]
    }
/////MAP LAYERS//////////
    //high Lake Level polygons
    let one_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_high_lake_level/FeatureServer/13",
        title: "1-year flood",
        visible: false,
        renderer: polygonStyle,
        opacity: 0.6
    });
    let ten_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map1/FeatureServer/0",
        title: "10-year flood",
        visible: false,
        renderer: polygonStyle,
        opacity: 0.6
    });
    let one_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_high_lake_level/FeatureServer/0",
        title: "100-year flood",
        visible: false,
        renderer: polygonStyle,
        opacity: 0.6
    });
    let five_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_high_lake_level/FeatureServer/0",
        title: "500-year flood",
        visible: false,
        renderer: polygonStyle,
        opacity: 0.6
    });

    //low Lake Level polygons
    let one_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_low_lake_level/FeatureServer/0",
        title: "1-year flood",
        visible: false,
        renderer: polygonStyle,
        opacity: 0.6
    });
    let fifty_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/50_year_low/FeatureServer/0",
        title: "50-year flood",
        visible: false,
        renderer: polygonStyle,
        opacity: 0.6
    });
    let one_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_lake_level_low/FeatureServer/0",
        title: "100-year flood",
        visible: false,
        renderer: polygonStyle,
        opacity: 0.6
    });
    let five_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_low/FeatureServer/0",
        title: "500-year flood",
        visible: false,
        renderer: polygonStyle,
        opacity: 0.6
    });

    //high lake level lines
    let one_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_high_lake_level/FeatureServer/13",
        title: "1-year flood line",
        renderer: lineStyle,
        listMode: "hide",
        visible: false
    });
    let ten_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map1/FeatureServer/0",
        title: "10-year flood line",
        renderer: lineStyle,
        listMode: "hide",
        visible: false
    });
    let one_hundred_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_high_lake_level/FeatureServer/0",
        title: "100-year flood line ",
        renderer: lineStyle,
        listMode: "hide",
        visible: false
    });
    let five_hundred_year_high_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_high_lake_level/FeatureServer/0",
        title: "500-year flood line",
        renderer: lineStyle,
        listMode: "hide",
        visible: false
    });

    //low lake level lines
    let one_year_low_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_low_lake_level/FeatureServer/0",
        title: "1-year flood",
        visible: false,
        renderer: lineStyle,
        listMode: "hide"
    });
    let fifty_year_low_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/50_year_low/FeatureServer/0",
        title: "50-year flood",
        visible: false,
        renderer: lineStyle,
        listMode: "hide"
    });
    let one_hundred_year_low_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_lake_level_low/FeatureServer/0",
        title: "100-year flood",
        visible: false,
        renderer: lineStyle,
        listMode: "hide"
    });
    let five_hundred_year_low_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_low/FeatureServer/0",
        title: "500-year flood",
        visible: false,
        renderer: lineStyle,
        listMode: "hide"

    });

    //polygon/line layer groups
    let lineLayersHigh = [one_year_high_trailing, ten_year_high_trailing, one_hundred_year_high_trailing, five_hundred_year_high_trailing],
        lineLayersLow = [one_year_low_trailing, fifty_year_low_trailing, one_hundred_year_low_trailing, five_hundred_year_low_trailing],
        polyLayersHigh = [one_year_high, ten_year_high, one_hundred_year_high, five_hundred_year_high],
        polyLayersLow = [one_year_low, fifty_year_low, one_hundred_year_low, five_hundred_year_low];
    
    //set default line layer group based on lake depth
    let lineLayers = lineLayersHigh;


/////MAP CREATION/////
    //Set up the basemap
    const map = new Map({
        basemap: "arcgis-topographic",
        layers: polyLayersHigh.concat(lineLayersHigh).concat(lineLayersLow).concat(polyLayersLow)
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

/////LAKE LEVEL SWITCH////
    document.querySelector("#lake-level-low").addEventListener("click",function(event){
        //clearLineLayers();
        let temp = polyLayersHigh.concat(lineLayersHigh)
        temp.forEach(function(layer){
            layer.visible = false;
        })

        document.querySelectorAll("input").forEach(function(elem){
            elem.checked = false;
        })

        lakeLevel = "low";
        event.target.style.background = "rgba(255,255,255,0.6)"
        document.querySelector("#lake-level-high").style.background = "none";
    })
    document.querySelector("#lake-level-high").addEventListener("click",function(){
        //clearLineLayers();
        let temp = polyLayersLow.concat(lineLayersLow)
        temp.forEach(function(layer){
            layer.visible = false;
        })

        document.querySelectorAll("input").forEach(function(elem){
            elem.checked = false;
        })

        lakeLevel = "high";
        event.target.style.background = "rgba(255,255,255,0.6)"
        document.querySelector("#lake-level-low").style.background = "none";
    })

//////Layer list/////
polyLayersHigh.forEach(function(layer, i){
    document.querySelector("#flood-level-container").insertAdjacentHTML("beforeend","<input id='f" + layer.title.replace(/\s/g, "") + "' type='radio' name='flood-layer'></input><label>" + layer.title + "</label><br>")
    document.querySelector("#f" + layer.title.replace(/\s/g, "")).addEventListener("click",function(){
        //hide layers based on selection
        //hide low lake layers 
        if (lakeLevel == "high"){
            polyLayersHigh.forEach(function(l){
                l.visible = false;
            })
            layer.visible = true;
        }
        //hide high lake layers
        else{
            polyLayersLow.forEach(function(l){
                l.visible = false;
            })
            polyLayersLow[i].visible = true;
        }
    })
})

//overlays
lineLayersHigh.forEach(function(layer,i){
    document.querySelector("#overlay-container").insertAdjacentHTML("beforeend","<input id='f" + layer.title.replace(/\s/g, "") + "' type='radio' name='flood-overlay'></input><label>" + layer.title + "</label><br>")
    document.querySelector("#f" + layer.title.replace(/\s/g, "")).addEventListener("click",function(){
        if (lakeLevel == "high"){
            lineLayersHigh.forEach(function(l){
                l.visible = false;
            })
            layer.visible = true;
        }
        else{
            lineLayersLow.forEach(function(l){
                l.visible = false;
            })
            lineLayersLow[i].visible = true;
        }

    })
})

/////PRINT FUNCTION/////
    /*const print = new Print({
        view: view,
        // specify your own print service
        printServiceUrl:
            "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    });

    view.ui.add(print, {
        position: "top-right"
    });*/

//////DEPTH QUERY////////
    //depth popup
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
    //image raster layer
    let depth_hundred_year_high = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_100_year_high/ImageServer",
        title: "Depth 100-year flood",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        listMode: "hide",
        opacity: .5
    });
    //map event
    view.on("click", (event) => {
        if (one_hundred_year_high.visible === true) {
            map.add(depth_hundred_year_high)
        } else {
            map.remove(depth_hundred_year_high)
        }
    })

/////LAYER LIST FUNCTIONS/////
   /*async function defineActions(event) {
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

    function clearLineLayers(){
        lineLayers.forEach(function(item){
            if (item.visible)
                map.remove(item)
        })
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
            // Capture the action id.
            const id = event.action.id;

            if (id === "information") {
                if (checkedLine) {
                    checkedLine.className = "esri-icon-radio-unchecked"
                }
                checkedLine = event.action

                checkedLine.className = "esri-icon-radio-checked"
                //test adding line layer
                clearLineLayers();

                if (event.item.title == "1-year flood"){
                    if (lakeLevel == "high")
                        map.add(one_year_high_trailing)
                    else
                        map.add(one_year_low_trailing)
                }
                if (event.item.title == "10-year flood"){
                    map.add(ten_year_high_trailing)
                }
                if (event.item.title == "100-year flood"){
                    if (lakeLevel == "high")
                        map.add(one_hundred_year_high_trailing)
                    else
                        map.add(one_hundred_year_low_trailing)
                }
                if (event.item.title == "500-year flood"){
                    map.add(five_hundred_year_high_trailing)
                }

            }
        });
        // Add widget to the top right corner of the view
        view.ui.add(layerList, "bottom-right");
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
*/
});
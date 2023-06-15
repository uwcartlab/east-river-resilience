require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/Basemap",
    "esri/widgets/BasemapGallery",
    "esri/layers/ImageryTileLayer",
    "esri/widgets/Swipe",
    "esri/widgets/Print",
    "esri/rest/support/AlgorithmicColorRamp"

], function (esriConfig, Map, MapView, FeatureLayer, Basemap, BasemapGallery, ImageryTileLayer, Swipe, Print, AlgorithmicColorRamp) {
//////GLOBAL VARIABLES////////
    //Set the API key
    esriConfig.apiKey = "AAPK539d9a98e214453db04a93dfaea676adrxOVh3ZE6LGf-_99lThjFmfwvhD2YHTXoC2px7zOQ0x8qZ9nwvwoeuZn0PgmFA_f"

    let checkedLine = null,
        compare = false,
        //currentLevel = "one-year";
        lakeLevel = "high",
        swipe;

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
    //select lake level
    function selectLakeLevel(level, elem, initial){
        if (compare){
            swipe.destroy();
        }

        compare = false;
        
        map.layers.forEach(function(layer, i){
            layer.visible = false;
        })

        document.querySelectorAll("input").forEach(function(elem, i){
            if (i == 0)
                elem.checked = true;
            else
                elem.checked = false;
        })
        
        initial.visible = true;
        lakeLevel = level;
        document.querySelector("#lake-level-high").style.background = "none";
        document.querySelector("#lake-level-low").style.background = "none";
        document.querySelector("#lake-level-compare").style.background = "none";
        elem.style.background = "rgba(255,255,255,0.6)"
    }
    //add listeners to the selection buttons
    document.querySelector("#lake-level-low").addEventListener("click",function(event){
        selectLakeLevel("low", event.target, one_year_low);
    })
    document.querySelector("#lake-level-high").addEventListener("click",function(event){
        selectLakeLevel("high", event.target, one_year_high);
    })
//////Comparison Switch/////
    //create the swipe feature and add it to the view
    function createSwipe(){
        //create swipe ui
        swipe = new Swipe({
            view: view,
            leadingLayers: [],
            trailingLayers: [],
            position: 50
        });
        // add the widget to the view
        view.ui.add(swipe);
    }
    //set listener for the comparison 
    document.querySelector("#lake-level-compare").addEventListener("click",function(event){
        compare = true;
        
        createSwipe();
        //remove all map layers
        map.layers.forEach(function(layer){
            layer.visible = false;
        })
        //clear overlay checkboxes
        document.querySelectorAll(".flood-overlay").forEach(function(elem){
            elem.checked = false;
        })

        //add corresponding layers to the swipe button
        polyLayersHigh.forEach(function(layer,i){
            if(document.querySelector("#f" + layer.title.replace(/\s/g, "")).checked){
                //set trailing/leading layers
                swipe.leadingLayers = [layer];
                swipe.trailingLayers = [polyLayersLow[i]];
                //activate layers
                layer.visible = true;
                polyLayersLow[i].visible = true;
            };
        })

        event.target.style.background = "rgba(255,255,255,0.6)"
        document.querySelector("#lake-level-low").style.background = "none";
        document.querySelector("#lake-level-high").style.background = "none";

    })

//////Layer list/////
polyLayersHigh.forEach(function(layer, i){
    //if it is the first layer in the list, activate that layer and check the associated radio button
    let checked = "";
    if (i == 0){
        checked = "checked";
        layer.visible = true;
    }
    //create radio buttons
    document.querySelector("#flood-level-container").insertAdjacentHTML("beforeend","<input id='f" + layer.title.replace(/\s/g, "") + "' type='radio' name='flood-layer' " + checked + "></input><label class='flood-label'>" + layer.title + "</label><br>")
    document.querySelector("#f" + layer.title.replace(/\s/g, "")).addEventListener("click",function(){
        //hide all lake level layers
        polyLayersHigh.forEach(function(l){
            l.visible = false;
        })
        polyLayersLow.forEach(function(l){
            l.visible = false;
        })
        //show high and low lake layers for comparison
        if (compare == true){
            //remove existing swipe interface
            swipe.destroy();
            //create new swipe interface
            createSwipe();
            //add selected lake levels to the interface and make them visible
            swipe.leadingLayers = [layer];
            swipe.trailingLayers = [polyLayersLow[i]];

            layer.visible = true;
            polyLayersLow[i].visible = true;
        }
        else{
            //add layer for high lake level
            if (lakeLevel == "high"){
                layer.visible = true;
            }
            //add layer for low lake level
            else{
                polyLayersLow[i].visible = true;
            }
        }
    })
})

//overlays
lineLayersHigh.forEach(function(layer,i){
    document.querySelector("#overlay-container").insertAdjacentHTML("beforeend","<input id='f" + layer.title.replace(/\s/g, "") + "' type='checkbox' name='flood-overlay' class='flood-overlay'></input><label class='overlay-label'>" + layer.title + "</label><br>")
    document.querySelector("#f" + layer.title.replace(/\s/g, "")).addEventListener("click",function(event){
        if (compare == true){
            if (event.target.checked){
                layer.visible = true;
                lineLayersLow[i].visible = true;

                swipe.leadingLayers.push(layer)
                swipe.trailingLayers.push(lineLayersLow[i])
            }
            else{
                layer.visible = false;
                lineLayersLow[i].visible = false;

                let x = array.indexOf(layer);
                swipe.leadingLayers.splice(x,1)
                let y = array.indexOf(lineLayersLow[i]);
                swipe.trailingLayers.splice(y,1)
            }
        }
        else{
            //set visibility of selected layer based on 
            if (lakeLevel == "high"){
                if (event.target.checked)
                    layer.visible = true;
                else
                    layer.visible = false;
            }
            else{
                if (event.target.checked)
                    lineLayersLow[i].visible = true;
                else
                    lineLayersLow[i].visible = false;
            }
    
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

});
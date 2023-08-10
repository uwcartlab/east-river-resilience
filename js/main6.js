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
        type = "extent",
        lakeLevel = "high",
        currentLayer = 0,
        swipe;

//////LAYER RENDERERS///////
    //polygon style
    const polygonStyle = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color:[15, 58, 62, 0.6],
            outline: {
                style: "solid",
                width: "1",
                color: [15, 58, 62, 1]
            }
        }
    }
    const polygonStyle2 = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color:[35, 135, 144, 0.6],
            outline: {
                style: "solid",
                width: "1",
                color: [35, 135, 144, 1]
            }
        }
    }
    const polygonStyle3 = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color:[70, 199, 210, 0.6],
            outline: {
                style: "solid",
                width: "1",
                color: [70, 199, 210, 1]
            }
        }
    }
    const polygonStyle4 = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color:[152, 224, 230, 0.6],
            outline: {
                style: "solid",
                width: "1",
                color: [152, 224, 230, 1]
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
                width: "1",
                color: [2, 62, 72, 0.5]
            }
        }
    }
    //raster depth renderer
    const rasterRenderer = {
        type: "raster-stretch",
        colorRamp: {
            type:"algorithmic",
            algorithm: 'lab-lch',
            toColor: "#012a32",
            fromColor: "#cdf6fe"
        },
        stretchType: 'min-max',
        statistics: [{
            min: 1,
            max: 10 
        }]
    }
/////POPUP RENDERER//////
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
/////MAP LAYERS//////////
    //DEPTH RASTERS
    //high lake levels
    let one_year_high_depth = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_1_year_high/ImageServer",
        title: "1-year Flood Depth",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        visible:false,
        listMode: "hide",
        opacity: .5
    });
    let ten_year_high_depth = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_10_year_high/ImageServer",
        title: "10-year Flood Depth",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        visible:false,
        listMode: "hide",
        opacity: .5
    });
    let one_hundred_year_high_depth = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_100_year_high/ImageServer",
        title: "100-year Flood Depth",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        visible:false,
        listMode: "hide",
        opacity: .5
    });
    let five_hundred_year_high_depth = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_500_year_high/ImageServer",
        title: "500-year Flood Depth",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        visible:false,
        listMode: "hide",
        opacity: .5
    });
    //low lake levels
    let one_year_low_depth = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_1_year_low/ImageServer",
        title: "1-year Flood Depth",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        visible:false,
        listMode: "hide",
        opacity: .5
    });
    let ten_year_low_depth = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_10_year_low/ImageServer",
        title: "10-year Flood Depth",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        visible:false,
        listMode: "hide",
        opacity: .5
    });
    let one_hundred_year_low_depth = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_100_year_low/ImageServer",
        title: "100-year Flood Depth",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        visible:false,
        listMode: "hide",
        opacity: .5
    });
    let five_hundred_year_low_depth = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_500_year_low/ImageServer",
        title: "500-year Flood Depth",
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        visible:false,
        listMode: "hide",
        opacity: .5
    });
    //EXTENT POLYGONS
    //high Lake level
    let one_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_high_lake_level/FeatureServer/13",
        title: "1-year Flood Extent",
        visible: false,
        renderer: polygonStyle,
        blendMode:"multiply",
        opacity: 0.6
    });
    let ten_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map1/FeatureServer/0",
        title: "10-year Flood Extent",
        visible: false,
        renderer: polygonStyle2,
        blendMode:"multiply",
        opacity: 0.6
    });
    let one_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_high_lake_level/FeatureServer/0",
        title: "100-year Flood Extent",
        visible: false,
        renderer: polygonStyle3,
        blendMode:"multiply",
        opacity: 0.6
    });
    let five_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_high_lake_level/FeatureServer/0",
        title: "500-year Flood Extent",
        visible: false,
        renderer: polygonStyle4,
        blendMode:"multiply",
        opacity: 0.6
    });

    //low lake Level
    let one_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_low_lake_level/FeatureServer/0",
        title: "1-year Flood Extent",
        visible: false,
        renderer: polygonStyle,
        blendMode:"multiply",
        opacity: 0.6
    });
    let ten_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/10_year_low/FeatureServer/0",
        title: "10-year Flood Extent",
        visible: false,
        renderer: polygonStyle2,
        blendMode:"multiply",
        opacity: 0.6
    });
    let one_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_lake_level_low/FeatureServer/0",
        title: "100-year Flood Extent",
        visible: false,
        renderer: polygonStyle3,
        blendMode:"multiply",
        opacity: 0.6
    });
    let five_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_low/FeatureServer/0",
        title: "500-year Flood Extent",
        visible: false,
        renderer: polygonStyle4,
        blendMode:"multiply",
        opacity: 0.6
    });
    //LINE LAYERS
    //high lake level
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
    //low lake level 
    let one_year_low_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_low_lake_level/FeatureServer/0",
        title: "1-year flood line",
        visible: false,
        renderer: lineStyle,
        listMode: "hide"
    });
    let ten_year_low_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/10_year_low/FeatureServer/0",
        title: "50-year flood line",
        visible: false,
        renderer: lineStyle,
        listMode: "hide"
    });
    let one_hundred_year_low_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_lake_level_low/FeatureServer/0",
        title: "100-year flood line",
        visible: false,
        renderer: lineStyle,
        listMode: "hide"
    });
    let five_hundred_year_low_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_low/FeatureServer/0",
        title: "500-year flood line",
        visible: false,
        renderer: lineStyle,
        listMode: "hide"

    });
    //HAZUS Points
    //High Lake Level
    let HAZUS_one_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_1Year_High/FeatureServer/0",
        title: "1-year HAZUS",
        visible: false
    });
    let HAZUS_ten_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_10Year_High/FeatureServer/0",
        title: "10-year HAZUS",
        visible: false
    });
    let HAZUS_one_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_100Year_High/FeatureServer/0",
        title: "100-year HAZUS",
        visible: false
    });
    let HAZUS_five_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_500Year_High/FeatureServer/0",
        title: "500-year HAZUS",
        visible: false
    });
    //Low Lake Level
    let HAZUS_one_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_1Year_Low/FeatureServer/0",
        title: "1-year HAZUS",
        visible: false
    });
    let HAZUS_ten_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_10Year_Low/FeatureServer/0",
        title: "10-year HAZUS",
        visible: false
    });
    let HAZUS_one_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_100Year_Low/FeatureServer/0",
        title: "100-year HAZUS",
        visible: false
    });
    let HAZUS_five_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_500Year_Low/FeatureServer/0",
        title: "500-year HAZUS",
        visible: false
    });

    //raster/polygon/line layer groups
    let lineLayersHigh = [one_year_high_trailing, ten_year_high_trailing, one_hundred_year_high_trailing, five_hundred_year_high_trailing],
        lineLayersLow = [one_year_low_trailing, ten_year_low_trailing, one_hundred_year_low_trailing, five_hundred_year_low_trailing],
        polyLayersHigh = [one_year_high, ten_year_high, one_hundred_year_high, five_hundred_year_high],
        polyLayersLow = [one_year_low, ten_year_low, one_hundred_year_low, five_hundred_year_low],
        depthLayersHigh = [one_year_high_depth, ten_year_high_depth, one_hundred_year_high_depth, five_hundred_year_high_depth],
        depthLayersLow = [one_year_low_depth, ten_year_low_depth, one_hundred_year_low_depth, five_hundred_year_low_depth],
        hazusLayersHigh = [HAZUS_one_year_high, HAZUS_ten_year_high, HAZUS_one_hundred_year_high, HAZUS_five_hundred_year_high],
        hazusLayersLow = [HAZUS_one_year_low, HAZUS_ten_year_low, HAZUS_one_hundred_year_low, HAZUS_five_hundred_year_low];
        
    //set default line layer group based on lake depth
    let lineLayers = lineLayersHigh;

/////MAP CREATION/////
    //Set up the basemap
    const map = new Map({
        basemap: "arcgis-topographic",
        layers: polyLayersHigh.concat(lineLayersHigh).concat(depthLayersHigh).concat(hazusLayersHigh).concat(lineLayersLow).concat(polyLayersLow).concat(depthLayersLow).concat(hazusLayersLow)
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
    let arcgisHybrid = Basemap.fromId("arcgis-imagery")

    //Set up the basemap gallery widget
    const basemapGallery = new BasemapGallery({
        view: view,
        source: [arcgisTopo, arcgisHybrid]
    });

/////UNIVERSAL FUNCTIONS
//add a layer
function addLayers(highLayers, lowLayers){
    if (compare == true){
        //only set compare for non-line layers
        if (highLayers != lineLayersHigh)
            setSwipe(highLayers,lowLayers)
    }
    else{
        //add layer for high lake level
        if (lakeLevel == "high"){
            highLayers[currentLayer].visible = true;
        }
        //add layer for low lake level
        else{
            lowLayers[currentLayer].visible = true;
        }
    }
}
//remove all layers
function removeLayers(){
    map.layers.forEach(function(layer, i){
        layer.visible = false;
    })
}
//check appropriate boxes
function checkBoxes(){
    document.querySelectorAll("." + type + "-layer").forEach(function(elem, i){
        if (i == currentLayer)
            elem.checked = true;
        else
            elem.checked = false;
    })

}

/////LAKE LEVEL SWITCH////
    //select lake level
    function selectLakeLevel(level, elem){
        if (compare){
            swipe.destroy();
            document.querySelector(".swipe-label-container").style.display = "none";
        }

        compare = false;
        
        removeLayers();

        lakeLevel = level;
        document.querySelector("#lake-level-high").style.background = "none";
        document.querySelector("#lake-level-low").style.background = "none";
        document.querySelector("#lake-level-compare").style.background = "none";
        elem.style.background = "rgba(255,255,255,0.6)";

        if (type == "extent"){
            document.querySelectorAll(".extent-layer").forEach(function(checkbox, i){
                if (checkbox.checked == true){
                    currentLayer = i;
                    addLayers(polyLayersHigh,polyLayersLow)
                }
            })
        }
        if (type == "depth"){
            checkBoxes();

            addLayers(depthLayersHigh,depthLayersLow)
            addLayers(lineLayersHigh, lineLayersLow)
        }

        addOverlay();
    }
    //add listeners to the selection buttons
    document.querySelector("#lake-level-low").addEventListener("click",function(event){
        selectLakeLevel("low", event.target);
    })
    document.querySelector("#lake-level-high").addEventListener("click",function(event){
        selectLakeLevel("high", event.target);
    })
/////DATA TYPE SWITCH////
    document.querySelectorAll(".data-type").forEach(function(elem){
        elem.addEventListener("click",function(event){
            //switch selected button background
            document.querySelector("#flood-" + type + "-container").style.display = "none";
            document.querySelector("#" + type).style.background = "none";
            
            document.querySelector("#flood-" + elem.id + "-container").style.display = "block";
            event.target.style.background = "rgba(255,255,255,0.6)";
            //set new data type
            type = elem.id;
            //remove all layers
            removeLayers();
            //set checkboxes
            checkBoxes();
            //add layers based on type
            if (type == "extent"){
                addLayers(polyLayersHigh,polyLayersLow)
            }
            if (type == "depth"){
                addLayers(depthLayersHigh,depthLayersLow)
                selectLayer(lineLayersHigh, lineLayersLow)
            }
            //add overlay
            addOverlay();
        })
    })

//////COMPARISON SWITCH/////
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
    //set the swipe conditions
    function setSwipe(highLayers, lowLayers){
        if (swipe)
            swipe.destroy();
        
        compare = true;
        
        createSwipe();
        //remove all map layers
        removeLayers();
        //clear overlay checkboxes
        document.querySelectorAll(".flood-overlay").forEach(function(elem){
            elem.checked = false;
        })
        //add corresponding layers to the swipe button
        highLayers.forEach(function(layer,i){
            if(document.querySelector("#f" + layer.title.replace(/\s/g, "")).checked){
                //add lines to depth map
                if (type == "depth"){
                    //set trailing/leading layers
                    swipe.leadingLayers = [lineLayersHigh[i], layer];
                    swipe.trailingLayers = [lineLayersLow[i], lowLayers[i]];
                    //activate layers
                    layer.visible = true;
                    lowLayers[i].visible = true;
                    //activate line outlines
                    lineLayersHigh[i].visible = true;
                    lineLayersLow[i].visible = true;
                }
                if (type == "extent"){
                    //set trailing/leading layers
                    swipe.leadingLayers.push(layer);
                    swipe.trailingLayers.push(lowLayers[i]);
                    //activate layers
                    layer.visible = true;
                    lowLayers[i].visible = true;
                }
            };
        })
    }
    //set listener for the comparison 
    document.querySelector("#lake-level-compare").addEventListener("click",function(event){
        if (type == "extent")
            setSwipe(polyLayersHigh,polyLayersLow);
        if (type == "depth")
            setSwipe(depthLayersHigh,depthLayersLow);

        document.querySelector(".swipe-label-container").style.display = "block";

        event.target.style.background = "rgba(255,255,255,0.6)"
        document.querySelector("#lake-level-low").style.background = "none";
        document.querySelector("#lake-level-high").style.background = "none";
    })
//CREATE LAYER LISTS
function selectLayer(highLayers, lowLayers){
    //show high and low lake layers for comparison
    addLayers(highLayers,lowLayers)
    //add overlay layers
    addOverlay();
}
//////Depth Layer list/////
depthLayersHigh.forEach(function(layer, i){
    //create radio buttons
    document.querySelector("#flood-depth-container").insertAdjacentHTML("beforeend","<input id='f" + layer.title.replace(/\s/g, "") + "' type='radio' name='flood-layer' class='depth-layer'></input><label class='flood-label'>" + layer.title + "</label><br>")
    document.querySelector("#f" + layer.title.replace(/\s/g, "")).addEventListener("click",function(){
        currentLayer = i;
        //hide all lake level layers
        removeLayers();

        selectLayer(depthLayersHigh, depthLayersLow)
        selectLayer(lineLayersHigh, lineLayersLow)
    })
})
//////Extent Layer list/////
polyLayersHigh.forEach(function(layer, i){
    //create radio buttons
    document.querySelector("#flood-extent-container").insertAdjacentHTML("beforeend","<b id='leg-" + i + "' class='legend-block'></b><input id='f" + layer.title.replace(/\s/g, "") + "' type='checkbox' name='flood-layer' class='extent-layer'></input><label class='flood-label'>" + layer.title + "</label><br>")
    document.querySelector("#f" + layer.title.replace(/\s/g, "")).addEventListener("click",function(event){
        if (event.target.checked){
            currentLayer = i;
            //hide all lake level layers
            selectLayer(polyLayersHigh, polyLayersLow)
        }
        else{
            polyLayersHigh[i].visible = false;
            polyLayersLow[i].visible = false;
        }
    })
    //if it is the first layer in the list, activate that layer and check the associated radio button
    if (i == currentLayer){
        layer.visible = true;
        document.querySelector("#f" + layer.title.replace(/\s/g, "")).checked = true;
    }
})

//overlays
function addOverlay(){
    hazusLayersHigh.forEach(function(layer,i){
        if (document.querySelector("#f" + layer.title.replace(/\s/g, "")).checked){
            if (lakeLevel == "high"){
                layer.visible = true;
            }
            else{
                hazusLayersLow[i].visible = true;
            }
        }
        else{
            layer.visible = false;
            hazusLayersLow[i].visible = false;
        }
    })
}
hazusLayersHigh.forEach(function(layer,i){
    document.querySelector("#overlay-container").insertAdjacentHTML("beforeend","<input id='f" + layer.title.replace(/\s/g, "") + "' type='checkbox' name='flood-overlay' class='flood-overlay'></input><label class='overlay-label'>" + layer.title + "</label><br>")
    document.querySelector("#f" + layer.title.replace(/\s/g, "")).addEventListener("click",function(event){
        if (compare == true){
            if (event.target.checked){
                layer.visible = true;
                lineLayersLow[i].visible = true;

                swipe.leadingLayers.push(layer)
                swipe.trailingLayers.push(hazusLayersLow[i])
            }
            else{
                layer.visible = false;
                hazusLayersLow[i].visible = false;
            }
        }
        else{
            //set visibility of selected layer based on 
            addOverlay();
    
        }

    })
})
/*lineLayersHigh.forEach(function(layer,i){
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
            }
        }
        else{
            //set visibility of selected layer based on 
            addOverlay();
    
        }

    })
})*/

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
  
    
    //map event
    /*view.on("click", (event) => {
        if (one_hundred_year_high.visible === true) {
            map.add(depth_hundred_year_high)
        } else {
            map.remove(depth_hundred_year_high)
        }
    })*/
/////RESPONSIVE DESIGN
    function resize(){
        let w = document.querySelector("body").clientWidth;
        if (w > 539){
            view.ui.add(basemapGallery, {
                position: "top-right"
            });
        }
        else{
            view.ui.remove(basemapGallery, {
                position: "top-right"
            });
        }
    }

    document.querySelector("#show-panel").addEventListener("click",function(event){
        event.target.style.display = "none";
        document.querySelector("#infoPanel").style.display = "block";
    })
    document.querySelector("#close").addEventListener("click",function(){
        document.querySelector("#show-panel").style.display = "block";
        document.querySelector("#infoPanel").style.display = "none";
    })

    window.addEventListener('resize', resize);
    document.addEventListener('DOMContentLoaded',resize)
    resize();

});
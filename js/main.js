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
    "esri/rest/support/AlgorithmicColorRamp",
    "esri/widgets/Measurement"

], function (esriConfig, Map, MapView, FeatureLayer, Basemap, BasemapGallery, ImageryTileLayer, Swipe, Print, AlgorithmicColorRamp, Measurement) {
//////GLOBAL VARIABLES////////
    //Set the API key
    esriConfig.apiKey = "AAPK539d9a98e214453db04a93dfaea676adrxOVh3ZE6LGf-_99lThjFmfwvhD2YHTXoC2px7zOQ0x8qZ9nwvwoeuZn0PgmFA_f"

    let checkedLine = null,
        compare = false,
        type = "extent",
        lakeLevel = "high",
        currentLayer = 0,
        swipe,
        infrastructureLayer = false;

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
                color: [0, 0, 0, 0.8]
            }
        }
    }
    //dashed line style
    const dashLineStyle = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            style: "none",
            outline: {
                style: "dash-dot",
                width: "0.5",
                color: [0, 0, 0, 0.5]
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
    
/////POINT RENDERER//////
const pointStyle = {
    type: "simple",
    symbol: {
        type: "simple-marker",  
        size: 5,
        color:"#5d090b",
        outline: {
            style: "solid",
            width: "1",
            color: "white"
        }
    }
}
const pointStyle2 = {
    type: "simple",
    symbol: {
        type: "simple-marker",  
        size: 5,
        color:"#b1201b",
        outline: {
            style: "solid",
            width: "0.5",
            color: "white"
        }
    }
}
const pointStyle3 = {
    type: "simple",
    symbol: {
        type: "simple-marker",  
        size: 5,
        color:"#fb6a4a",
        outline: {
            style: "solid",
            width: "0.5",
            color: "white"
        }
    }
}
const pointStyle4 = {
    type: "simple",
    symbol: {
        type: "simple-marker",  
        size: 5,
        color:"#fcae91",
        outline: {
            style: "solid",
            width: "0.5",
            color: "white"
        }
    }
}
/////SVI Style
//svi block style
const less35 = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [255,255,255,0.8],
    style: "solid",
    outline: {
      width: 0.2,
      color: [255, 255, 255, 0.5]
    }
  };
const less50 = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [217,217,217,0.8],
    style: "solid",
    outline: {
      width: 0.2,
      color: [255, 255, 255, 0.5]
    }
};
  
const more50 = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [140,140,140,0.8],
    style: "solid",
    outline: {
      width: 0.2,
      color: [255, 255, 255, 0.5]
    }
};
  
const more75 = {
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [51,51,51,0.7],
    style: "solid",
    outline: {
      width: 0.2,
      color: [255, 255, 255, 0.5]
    }
};

const sviStyle = {
    type: "class-breaks", // autocasts as new ClassBreaksRenderer()
    field: "SoVIScore", // total number of adults (25+) with a college degree
    defaultSymbol: {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: "black",
      style: "backward-diagonal",
      outline: {
        width: 0.5,
        color: [50, 50, 50, 0.6]
      }
    },
    defaultLabel: "no data",
    classBreakInfos: [
        {
          minValue: 0,
          maxValue: 0.3499,
          symbol: less35,
          label: "< 35%" // label for symbol in legend
        },
        {
          minValue: 0.35,
          maxValue: 0.4999,
          symbol: less50,
          label: "35 - 50%" // label for symbol in legend
        },
        {
          minValue: 0.5,
          maxValue: 0.7499,
          symbol: more50,
          label: "50 - 75%" // label for symbol in legend
        },
        {
          minValue: 0.75,
          maxValue: 1.0,
          symbol: more75,
          label: "> 75%" // label for symbol in legend
        }
      ]
  };
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
    //EAST RIVER OUTLINE
    let east_river_outline = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/east_river_boundary/FeatureServer/0",
        title: "East River Outline",
        visible: true,
        renderer: lineStyle,
        opacity: 0.6
    });
    //municipal boundaries
    let brown_county_municipal = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Brown_County_Municipal_Boundaries/FeatureServer/0",
        title: "Municipal Boundaries",
        visible: true,
        renderer: dashLineStyle,
        opacity: 0.6
    });
    //DEPTH RASTERS
    //high lake levels
    let one_year_high_depth = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/depth_1_year_high/ImageServer",
        title: "1-year Flood Depth",
        customParameters: {
            "display": "2.1” in 24 hrs. (1-yr. storm)"
        },
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
        customParameters: {
            "display": "3.4” in 24 hrs. (10-yr. storm)"
        },
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
        customParameters: {
            "display": "5.4” in 24 hrs. (100-yr. storm)"
        },
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
        customParameters: {
            "display": "7.2” in 24 hrs. (500-yr. storm)"
        },
        popupEnabled: true,
        popupTemplate: imagePopupTemplate,
        renderer:rasterRenderer,
        visible:false,
        listMode: "hide",
        opacity: .5
    });
    //2D model
    let one_hundred_year_high_depth_2d = new ImageryTileLayer({
        url: "https://tiledimageservices.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/east_river__2d/ImageServer",
        title: "100-year Depth 2D Model",
        customParameters: {
            "display": "5.4” in 24 hrs. (2d Model)"
        },
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
        customParameters: {
            "display": "2.1” in 24 hrs. (1-yr. storm)"
        },
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
        customParameters: {
            "display": "3.4” in 24 hrs. (10-yr. storm)"
        },
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
        customParameters: {
            "display": "5.4” in 24 hrs. (100-yr. storm)"
        },
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
        customParameters: {
            "display": "7.2” in 24 hrs. (500-yr. storm)"
        },
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
        title: '1-year Flood Extent',
        customParameters: {
            "display": "2.1” in 24 hrs. (1-yr. storm)"
        },
        visible: false,
        renderer: polygonStyle,
        blendMode:"multiply",
        opacity: 0.6
    });
    let ten_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Map1/FeatureServer/0",
        title: "10-year Flood Extent",
        customParameters: {
            "display": "3.4” in 24 hrs. (10-yr. storm)"
        },
        visible: false,
        renderer: polygonStyle2,
        blendMode:"multiply",
        opacity: 0.6
    });
    let one_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_high_lake_level/FeatureServer/0",
        title: "100-year Flood Extent",
        customParameters: {
            "display": "5.4” in 24 hrs. (100-yr. storm)"
        },
        visible: false,
        renderer: polygonStyle3,
        blendMode:"multiply",
        opacity: 0.6
    });
    let five_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_high_lake_level/FeatureServer/0",
        title: "500-year Flood Extent",
        customParameters: {
            "display": "7.2” in 24 hrs. (500-yr. storm)"
        },
        visible: false,
        renderer: polygonStyle4,
        blendMode:"multiply",
        opacity: 0.6
    });

    //low lake Level
    let one_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/1_year_low_lake_level/FeatureServer/0",
        title: "1-year Flood Extent",
        customParameters: {
            "display": "2.1” in 24 hrs. (1-yr. storm)"
        },
        visible: false,
        renderer: polygonStyle,
        blendMode:"multiply",
        opacity: 0.6
    });
    let ten_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/10_year_low/FeatureServer/0",
        title: "10-year Flood Extent",
        customParameters: {
            "display": "3.4” in 24 hrs. (10-yr. storm)"
        },
        visible: false,
        renderer: polygonStyle2,
        blendMode:"multiply",
        opacity: 0.6
    });
    let one_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/100_year_lake_level_low/FeatureServer/0",
        title: "100-year Flood Extent",
        customParameters: {
            "display": "5.4” in 24 hrs. (100-yr. storm)"
        },
        visible: false,
        renderer: polygonStyle3,
        blendMode:"multiply",
        opacity: 0.6
    });
    let five_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/500_year_low/FeatureServer/0",
        title: "500-year Flood Extent",
        customParameters: {
            "display": "7.2” in 24 hrs. (500-yr. storm)"
        },
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
    //2d model level
    let one_hundred_year_high_depth_2d_trailing = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/east_river_line/FeatureServer",
        title: "100-year flood line 2d Model",
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
        customParameters: {
            "display": "Impacted Buildings, 2.1”"
        },
        visible: false,
        blendMode:"darken",
        renderer:pointStyle
    });
    let HAZUS_ten_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_10Year_High/FeatureServer/0",
        title: "10-year HAZUS",
        customParameters: {
            "display": "Impacted Buildings, 3.4”"
        },
        visible: false,
        blendMode:"darken",
        renderer:pointStyle2
    });
    let HAZUS_one_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_100Year_High/FeatureServer/0",
        title: "100-year HAZUS",
        customParameters: {
            "display": "Impacted Buildings, 5.4”"
        },
        visible: false,
        blendMode:"darken",
        renderer:pointStyle3
    });
    let HAZUS_five_hundred_year_high = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_500Year_High/FeatureServer/0",
        title: "500-year HAZUS",
        customParameters: {
            "display": "Impacted Buildings, 7.2”"
        },
        visible: false,
        blendMode:"darken",
        renderer:pointStyle4
    });
    //Low Lake Level
    let HAZUS_one_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_1Year_Low/FeatureServer/0",
        title: "1-year HAZUS",
        customParameters: {
            "display": "Impacted Buildings, 2.1”"
        },
        visible: false,
        renderer:pointStyle
    });
    let HAZUS_ten_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_10Year_Low/FeatureServer/0",
        title: "10-year HAZUS",
        customParameters: {
            "display": "Impacted Buildings, 3.4”"
        },
        visible: false,
        renderer:pointStyle2
    });
    let HAZUS_one_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_100Year_Low/FeatureServer/0",
        title: "100-year HAZUS",
        customParameters: {
            "display": "Impacted Buildings, 5.4”"
        },
        visible: false,
        renderer:pointStyle3
    });
    let HAZUS_five_hundred_year_low = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/HAZUS_500Year_Low/FeatureServer/0",
        title: "500-year HAZUS",
        customParameters: {
            "display": "Impacted Buildings, 7.2”"
        },
        visible: false,
        renderer:pointStyle4
    });
    //SVI block groups
    let svi_blocks = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/EastRiver_SoVI/FeatureServer/0",
        title: "Social Vulnerability",
        customParameters: {
            "display": "Social Vulnerability"
        },
        visible: false,
        renderer:sviStyle
    });
    //infrastructure points
    /////INFRASTRUCTURE POINTS
    let substations = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/13",
        title: "Substation",
        customParameters: {
            "color": "#b37700",
            "shape":"triangle"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 7,
                style:"triangle",
                color:"#b37700",
                outline: {
                    style: "solid",
                    width: "0.5",
                    color: "white"
                }
            }
        }
    });
    let child_care = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/12",
        title: "Child Care",
        customParameters: {
            "color": "#40bf80",
            "shape":"circle"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 5,
                color:"#40bf80",
                outline: {
                    style: "solid",
                    width: "0.5",
                    color: "white"
                }
            }
        }
    });
    let wastewater = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/11",
        title: "Wastewater",
        customParameters: {
            "color": "#a3c2c2",
            "shape":"triangle"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 7,
                style:"triangle",
                color:"#a3c2c2",
                outline: {
                    style: "solid",
                    width: "0.5",
                    color: "white"
                }
            }
        }
    });
    let schools = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/1",
        title: "Schools",
        customParameters: {
            "color": "#944dff",
            "shape":"circle"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 5,
                color:"#944dff",
                outline: {
                    style: "solid",
                    width: "0.5",
                    color: "white"
                }
            }
        }
    });
    let fire_stations = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/2",
        title: "Fire Station",
        customParameters: {
            "color": "#EF3925",
            "shape":"square"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 5,
                style:"square",
                color:"#EF3925",
                outline: {
                    style: "solid",
                    width: "0.5",
                    color: "white"
                }
            }
        }
    });
    let hospitals = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/3",
        title: "Hospital",
        customParameters: {
            "color": "rgba(0,0,0,0)",
            "shape":"cross"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 5,
                style:"cross",
                color:"#EF3925",
                outline: {
                    style: "solid",
                    width: "2",
                    color: "#EF3925"
                }
            }
        }
    });
    let shelters = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/4",
        title: "Emerg. Shelter",
        customParameters: {
            "color": "#000000",
            "shape":"circle"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 5,
                color:"#000000",
                outline: {
                    style: "solid",
                    width: "0.5",
                    color: "white"
                }
            }
        }
    });
    let nursing_homes = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/5",
        title: "Nursing Home",
        customParameters: {
            "color": "#ffa31a",
            "shape":"circle"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 5,
                color:"#ffa31a",
                outline: {
                    style: "solid",
                    width: "0.5",
                    color: "white"
                }
            }
        }
    });
    let police = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/6",
        title: "Police",
        customParameters: {
            "color": "#0E7AC0",
            "shape":"square"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 5,
                style:"square",
                color:"#0E7AC0",
                outline: {
                    style: "solid",
                    width: "0.5",
                    color: "white"
                }
            }
        }
    });
    let sirens = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/7",
        title: "Emerg. Siren",
        customParameters: {
            "color": "rgba(0,0,0,0)",            
            "shape":"x"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 3,
                style:"x",
                color:"#000000",
                outline: {
                    style: "solid",
                    width: "2",
                    color: "#000000"
                }
            }
        }
    });
    let epcra = new FeatureLayer({
        url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Infrastructure_Points/FeatureServer/8",
        title: "Haz. Chemicals",
        customParameters: {
            "color": "#333333",
            "shape":"triangle"
        },
        visible: false,
        renderer: {
            type: "simple",
            symbol: {
                type: "simple-marker",  
                size: 7,
                style:"triangle",
                color:"#333333",
                outline: {
                    style: "solid",
                    width: "0.5",
                    color: "white"
                }
            }
        }
    });

///change order of features
    //raster/polygon/line layer groups
    let lineLayersHigh = [one_year_high_trailing, ten_year_high_trailing, one_hundred_year_high_trailing, five_hundred_year_high_trailing, one_hundred_year_high_depth_2d_trailing],
        lineLayersLow = [one_year_low_trailing, ten_year_low_trailing, one_hundred_year_low_trailing, five_hundred_year_low_trailing],
        polyLayersHigh = [one_year_high, ten_year_high, one_hundred_year_high, five_hundred_year_high],
        polyLayersLow = [one_year_low, ten_year_low, one_hundred_year_low, five_hundred_year_low],
        depthLayersHigh = [one_year_high_depth, ten_year_high_depth, one_hundred_year_high_depth, five_hundred_year_high_depth, one_hundred_year_high_depth_2d],
        depthLayersLow = [one_year_low_depth, ten_year_low_depth, one_hundred_year_low_depth, five_hundred_year_low_depth],
        hazusLayersHigh = [HAZUS_one_year_high, HAZUS_ten_year_high, HAZUS_one_hundred_year_high, HAZUS_five_hundred_year_high],
        hazusLayersLow = [HAZUS_one_year_low, HAZUS_ten_year_low, HAZUS_one_hundred_year_low, HAZUS_five_hundred_year_low],
        overlays = [svi_blocks],
        infrastructure = [hospitals,fire_stations,police,shelters,schools,nursing_homes,child_care,substations,wastewater,epcra,sirens]
    //set default line layer group based on lake depth
    let lineLayers = lineLayersHigh;

/////MAP CREATION/////
    //Set up the basemap
    const map = new Map({
        basemap: "arcgis-topographic",
        layers: [east_river_outline].concat(brown_county_municipal).concat(overlays).concat(hazusLayersHigh).concat(hazusLayersLow).concat(polyLayersHigh).concat(lineLayersHigh).concat(depthLayersHigh).concat(lineLayersLow).concat(polyLayersLow).concat(depthLayersLow).concat(infrastructure)
    });

    //Set up the Map View
    const view = new MapView({
        container: "viewDiv",
        map: map,
        extent: {
            xmin: -88.4407865369763,
            ymin: 44.3019512604157,
            xmax: -87.57033074655209,
            ymax: 44.58559644055305,
            spatialReference: 4326
        },
        zoom:11
    });

/////WIDGETS
    let basemap = false, measure = false, printer = false;
//basemap gallery
    //Basemap layers for gallery widget
    let arcgisTopo = Basemap.fromId("arcgis-topographic")
    let arcgisHybrid = Basemap.fromId("arcgis-imagery")

    //Set up the basemap gallery widget
    const basemapGallery = new BasemapGallery({
        view: view,
        source: [arcgisTopo, arcgisHybrid]
    });
//print
    const print = new Print({
        view: view,
        // specify your own print service
        printServiceUrl:
            "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"
    });
//widget listeners
//basemap
document.querySelector("#basemap").addEventListener("click",function(elem){
    if (basemap == false){
        clearWidgets();
        basemap = true;
        view.ui.add(basemapGallery, {
            position: "top-right"
        });
    }
    else{
        basemap = false;
        view.ui.remove(basemapGallery)
    }
})
//measure
let measurement;
document.querySelector("#measure").addEventListener("click",function(elem){
    //map measure tool
    if (measure == false){
        clearWidgets();
        measure = true;
        measurement = new Measurement({
            view: view,
            activeTool: "distance"
        });
        view.ui.add(measurement, "top-right");
    }
    else{
        measure = false;
        view.ui.remove(measurement)
        measurement.clear();
    }
})
//print
document.querySelector("#print").addEventListener("click",function(elem){
    if (printer == false){
        clearWidgets();
        printer = true;
        view.ui.add(print, {
            position: "top-right"
        });
    }
    else{
        printer = false;
        view.ui.remove(print);
    }
})
//clear other widgets
function clearWidgets(){
    if (basemap == true){
        basemap = false;
        view.ui.remove(basemapGallery)
    }
    if (measure == true){
        measure = false;
        view.ui.remove(measurement)
        measurement.clear();
    }
    if (printer == true){
        printer = false;
        view.ui.remove(print);  
    }
}
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
        document.querySelector("#lake-level-low").style.color = "#1b666b";
        document.querySelector("#lake-level-high").style.color = "#1b666b";
        document.querySelector("#lake-level-compare").style.color = "#1b666b";

        elem.style.background = "#1b666b";
        elem.style.color = "#e9e7da";

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

            add2dModel();
        }
        //add overlays
        addSvi();
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
            
            document.querySelector("#depth").style.color = "#1b666b";
            document.querySelector("#extent").style.color = "#1b666b";
            
            event.target.style.background = "#1b666b";
            event.target.style.color = "#e9e7da";
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

                add2dModel();
            }
            //add overlays
            addSvi();
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
        add2dModel();
        
        createSwipe();
        //remove all map layers
        removeLayers();
        //clear overlay checkboxes
        /*document.querySelectorAll(".flood-overlay").forEach(function(elem){
            elem.checked = false;
        })*/
        addSvi();
        addOverlay();
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

        event.target.style.background = "#1b666b"
        event.target.style.color = "#e9e7da"
        document.querySelector("#lake-level-low").style.background = "none";
        document.querySelector("#lake-level-high").style.background = "none";
        document.querySelector("#lake-level-low").style.color = "#1b666b";
        document.querySelector("#lake-level-high").style.color = "#1b666b";
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
    //create button for the 2d model, hide initially
    if (layer.title == "100-year Depth 2D Model")
        document.querySelector("#flood-depth-container").insertAdjacentHTML("beforeend","<input id='f" + layer.title.replace(/\s/g, "") + "' type='radio' name='flood-layer' class='depth-layer depth-2d-model'></input><label class='flood-label depth-2d-model'>" + layer.customParameters.display + "</label>")
    else
        document.querySelector("#flood-depth-container").insertAdjacentHTML("beforeend","<input id='f" + layer.title.replace(/\s/g, "") + "' type='radio' name='flood-layer' class='depth-layer'></input><label class='flood-label'>" + layer.customParameters.display + "</label><br>")
    
    document.querySelector("#f" + layer.title.replace(/\s/g, "")).addEventListener("click",function(){
        currentLayer = i;
        //hide all lake level layers
        removeLayers();

        selectLayer(depthLayersHigh, depthLayersLow)
        selectLayer(lineLayersHigh, lineLayersLow)

        addSvi();
    })
})
//////2d Model Data///////
function add2dModel(){
    let display;
    if (lakeLevel == 'high' && compare == false)
        display = "inline-block"
    else
        display = "none"

    document.querySelectorAll(".depth-2d-model").forEach(elem => {
        elem.style.display = display;
    })
}
//////Extent Layer list/////
polyLayersHigh.forEach(function(layer, i){
    //create radio buttons
    document.querySelector("#flood-extent-container").insertAdjacentHTML("beforeend","<b id='leg-" + i + "' class='legend-block'></b><input id='f" + layer.title.replace(/\s/g, "") + "' type='checkbox' name='flood-layer' class='extent-layer'></input><label class='flood-label'>" + layer.customParameters.display + "</label><br>")
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
            if (compare == true){
                layer.visible = true;
                hazusLayersLow[i].visible = true;

                swipe.leadingLayers.push(layer)
                swipe.trailingLayers.push(hazusLayersLow[i])
            }
            else{
                if (lakeLevel == "high"){
                    layer.visible = true;
                }
                else{
                    hazusLayersLow[i].visible = true;
                }
            }
        }
        else{
            layer.visible = false;
            hazusLayersLow[i].visible = false;
        }
    })
}

hazusLayersHigh.forEach(function(layer,i){
    document.querySelector("#overlay-container").insertAdjacentHTML("beforeend","<b id='ovr-" + i + "' class='legend-block'></b><input id='f" + layer.title.replace(/\s/g, "") + "' type='checkbox' name='flood-overlay' class='flood-overlay'></input><label class='overlay-label'>" + layer.customParameters.display + "</label><br>")
    document.querySelector("#f" + layer.title.replace(/\s/g, "")).addEventListener("click",function(event){
        if (compare == true){
            if (event.target.checked){
                layer.visible = true;
                hazusLayersLow[i].visible = true;

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

overlays.forEach(function(layer){
    document.querySelector("#overlay-container").insertAdjacentHTML("beforeend","<b id='svi-block' class='legend-block'></b><input id='svi' type='checkbox' name='flood-overlay' class='flood-overlay'></input><label class='overlay-label'>" + layer.customParameters.display + "</label><br>")

    document.querySelector("#overlay-container").insertAdjacentHTML("beforeend","<div id='svi-leg'><div id='svi-leg-block-container'><b class='svi-leg-block' style='background:rgba(255,255,255,0.8)'></b><b class='svi-leg-block' style='background:rgba(217,217,217,0.8)'></b><b class='svi-leg-block' style='background:rgba(140,140,140,0.8)'></b><b class='svi-leg-block' style='background:rgba(51,51,51,0.7)'></b></div><div id='svi-leg-block-label'><p>Lowest <--------> Highest</p></div></div>")

    document.querySelector("#svi").addEventListener("click",function(event){
        addSvi();
    })
})

//create infrastructure point overlay
document.querySelector("#overlay-container").insertAdjacentHTML("beforeend","<b id='svi-block' class='legend-block'></b><input type='checkbox' name='infrastructure-overlay' class='infrastructure-overlay'></input><label class='overlay-label'>Infrastructure</label><br>")
document.querySelector(".infrastructure-overlay").addEventListener("click",function(elem){
    let status = infrastructureLayer == true ? false : true;
    infrastructureLayer = status;

    infrastructure.forEach(function(item){
        item.visible = status;
    })

    if (infrastructureLayer == true)
        document.querySelector("#infrastructureDiv").style.display = "block";
    else    
        document.querySelector("#infrastructureDiv").style.display = "none";

})

function addSvi(){
    if (compare == true){
        if (document.querySelector("#svi").checked){
            svi_blocks.visible = true;

            swipe.leadingLayers.push(svi_blocks)
            swipe.trailingLayers.push(svi_blocks)

            document.querySelector("#svi-leg").style.display = "block";
        }
        else{
            svi_blocks.visible = false;
            svi_blocks.visible = false;

            document.querySelector("#svi-leg").style.display = "none";
        }
    }
    else{
        if (document.querySelector("#svi").checked){
            svi_blocks.visible = true;

            document.querySelector("#svi-leg").style.display = "block";
        }
        else{
            svi_blocks.visible = false;
            document.querySelector("#svi-leg").style.display = "none";
        }
    }
}

/////RESPONSIVE DESIGN
    function resize(){
        let w = document.querySelector("body").clientWidth;
        /*if (w > 539){
            view.ui.add(basemapGallery, {
                position: "top-right"
            });
        }
        else{
            view.ui.remove(basemapGallery, {
                position: "top-right"
            });
        }*/
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

    //modal 
    document.querySelector("#about-button").addEventListener("click",function(elem){
        document.querySelector("#about-modal").style.display = "block";
    })
    document.querySelectorAll(".close-modal").forEach(function(elem){
        elem.addEventListener("click",function(elem){
            document.querySelector("#about-modal").style.display = "none";
        })
    })
/////CREATE INFRASTRUCTURE LEGEND
    infrastructure.forEach(function(item){
        let infrastructureClass = item.customParameters.shape == 'x' ? "infrastructureX": item.customParameters.shape == 'cross' ? "infrastructureCross": item.customParameters.shape == 'square' ? "infrastructureSquare": item.customParameters.shape == 'triangle' ? "infrastructureTriangle" : "infrastructureCircle",
            style = item.customParameters.shape == 'triangle' ? 'border-bottom-color' : 'background-color',
            content = item.customParameters.shape == 'cross' ? '&#10010;' :item.customParameters.shape == 'x'? '&#10006;' : "";
        
        document.querySelector("#infrastructureDiv").insertAdjacentHTML("beforeend","<b class='" + infrastructureClass + "' style='" + style + ":" + item.customParameters.color + "'>" + content + "</b>")
        document.querySelector("#infrastructureDiv").insertAdjacentHTML("beforeend","<p>" + item.title + "</p><br>")
    })
/////LAYER INFORMATION
    document.querySelectorAll(".info-q").forEach(function(elem){
        let t = elem.attributes.getNamedItem("alt").value;
        console.log(elem.attributes)
        elem.addEventListener("click",function(e){
            if (document.querySelector(".info-hover")){
                document.querySelector(".info-hover").remove();
            }
            let panel = document.createElement("div")
            panel.classList.add("info-hover")
            panel.addEventListener("click",function(){
                panel.remove();
            })
            panel.innerHTML = t;
            panel.style.left = e.clientX/2;
            panel.style.top = e.clientY;
            document.querySelector("body").insertAdjacentElement("beforeend",panel)
        })
        elem.addEventListener("mouseover",function(e){
            if (document.querySelector(".info-hover")){
                document.querySelector(".info-hover").remove();
            }
            let panel = document.createElement("div")
            panel.classList.add("info-hover")
            panel.addEventListener("click",function(){
                panel.remove();
            })
            panel.innerHTML = t;
            panel.style.left = e.clientX/2;
            panel.style.top = e.clientY;
            document.querySelector("body").insertAdjacentElement("beforeend",panel)
        })
        elem.addEventListener("mouseleave",function(e){
            if (document.querySelector(".info-hover")){
                document.querySelector(".info-hover").remove();
            }
        })
    })

});
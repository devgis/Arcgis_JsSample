/* global dojo */
//引用dojo
dojo.require("esri/map");
dojo.require("dojo/_base/lang");
dojo.require("dojo/json");
dojo.require("esri/config");
dojo.require("esri/tasks/GeometryService");
dojo.require("esri/tasks/AreasAndLengthsParameters");
dojo.require("dojo/dom-class");
dojo.require("esri/dijit/Popup");
dojo.require("esri/dijit/PopupTemplate");
dojo.require("esri/toolbars/draw");
dojo.require("esri/symbols/SimpleFillSymbol");
dojo.require("esri/geometry/Point");
dojo.require("dojo/on");
dojo.require("dojo/dom");
dojo.require("dojo/_base/Color");
dojo.require("esri/dijit/Scalebar");
dojo.require("esri/dijit/InfoWindowLite");
dojo.require("esri/dijit/InfoWindow");
dojo.require("dojo/dom-construct");
dojo.require("esri/symbols/SimpleMarkerSymbol");
dojo.require("esri/symbols/PictureMarkerSymbol");
dojo.require("esri/symbols/SimpleLineSymbol");
dojo.require("esri/graphic");
dojo.require("dojo/dom-style");
dojo.require("dojo/query");
dojo.require("esri/layers/GraphicsLayer");
dojo.require("dojox/widget/ColorPicker");
dojo.require("esri/layers/CSVLayer");
dojo.require("esri/Color");
dojo.require("esri/renderers/SimpleRenderer");
dojo.require("esri/InfoTemplate");
dojo.require("esri/urlUtils");
dojo.require("esri/geometry/scaleUtils");
dojo.require("esri/dijit/HomeButton");
dojo.require("esri/tasks/RouteTask");
dojo.require("esri/toolbars/navigation");
dojo.require("esri/tasks/RouteParameters");
dojo.require("esri/tasks/FeatureSet");
dojo.require("esri/InfoTemplate");
dojo.require("dijit/Menu");
dojo.require("dijit/MenuItem");
dojo.require("esri/geometry/jsonUtils");
var geometryService;
var map;
var drawToolbar, selectedGraphics = new Array();
var toolbar, symbol, geomTask;
var distancetool;
//var currentlayer;
var psymbol;//默认样式
var pselsymbol;//选中样式
var dicsymbol;
var defaultsymbol; //默认点样式
var ctxMenuForGraphics, ctxMenuForMap;
var selected;
var selzoneindex = 0
var selectzonesymbol;
var defaultzonesymbol;
var defaultlinesymbol;
var currentLocation;
//var clusterLayer;
var popupOptions;
var graphicSelected;
var selectType = "bayonet"; //选择类型 bayonet 卡口 video 视频

//卡口样式默认样式
var commonSymbol_1; //默认
var commonSymbol_2; //鼠标滑过
var commonSymbol_3; //鼠标点击后

//卡口样式选择样式
var selectedSymbol_1; //默认
var selectedSymbol_2; //鼠标滑过
var selectedSymbol_3; //鼠标点击

//轨迹点选择样式
var selTrackPointSymbol_1; //默认
var selTrackPointSymbol_2; //鼠标滑过
var selTrackPointSymbol_3; //鼠标点击

//轨迹线样式
//var slsTrackStyle;
var closeSymbol1; //关闭轨迹线按钮
var closeSymbol2; //关闭轨迹线按钮
var closeSymbol3; //关闭轨迹线按钮

var closeSelSymbol; //关闭图元选中按钮
var closeSelLayer; //关闭图元选中图层

var carNOBKSymbol;
var carNOBKSymbolSel;
var strNull = "null"; //空字符标记

var dicColors; //线颜色颜色字典 key为数字 value为 Color
var dicCarNOColors; //车牌字体颜色字典 key为数字 value为 Color
var dicLineColors = new Array(strNull, strNull, strNull, strNull); //线与颜色字典 key 为线id value为颜色 key
var selTracLineColor; //选中的线颜色
var selCarNoColor; //选中的车牌颜色

var dicLineNode = new Array(); //线对应点字典
var dicTrackLineJason = new Array(); //线对应点字典 //轨迹线与原始Jason内容

//图层
var trackLineLayer;     //轨迹图层
var trackPointLayer;    //轨迹点图层
var bayonetLayer;       //卡口图层
var videoLayer;       //卡口图层
var historyPointLayer;       //历史纪录点图层

//地图工具
var navToolbar;
//从数组中删除指定位置的要素
Array.prototype.remove = function (dx) {
    if (isNaN(dx) || dx > this.length) { return false; }
    for (var i = 0, n = 0; i < this.length; i++) {
        if (this[i] != this[dx]) {
            this[n++] = this[i]
        }
    }
    this.length -= 1
}

function InitMap() {

    //esriConfig.defaults.map.slider = { right:"50px", bottom:"50px", width:"200px", height:null };
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl); //动态地图地址
    //var layer = new esri.layers.ArcGISTiledMapServiceLayer(mapServiceUrl);

    //地图缩放级别 一般不需要修改 可以增加删除
    var mylods = [
                { "level": 0, "resolution": 0.703125, "scale": 295497593.05875003 },
                { "level": 1, "resolution": 0.3515625, "scale": 147748796.52937502 },
                { "level": 2, "resolution": 0.17578125, "scale": 73874398.264687508 },
                { "level": 3, "resolution": 0.087890625, "scale": 36937199.132343754 },
                { "level": 4, "resolution": 0.0439453125, "scale": 18468599.566171877 },
                { "level": 5, "resolution": 0.02197265625, "scale": 9234299.7830859385 },
                { "level": 6, "resolution": 0.010986328125, "scale": 4617149.8915429693 },
                { "level": 7, "resolution": 0.0054931640625, "scale": 2308574.9457714846 },
                { "level": 8, "resolution": 0.00274658203125, "scale": 1154287.472885742 },
                { "level": 9, "resolution": 0.001373291015625, "scale": 577143.736442871 },
                { "level": 10, "resolution": 0.0006866455078125, "scale": 288571.8682214355 },
                { "level": 11, "resolution": 0.0003433227539, "scale": 144285.9341107178 },
                { "level": 12, "resolution": 0.0001716613769, "scale": 72142.96705535888 },
                { "level": 13, "resolution": 0.0000858306884, "scale": 36071.48352767944 },
                { "level": 14, "resolution": 0.0000429153442, "scale": 9017.870881919859 },
                { "level": 15, "resolution": 0.0000214576721, "scale": 4508.93544095993 },
                { "level": 16, "resolution": 0.0000107288360, "scale": 2254.467720479965 },
                { "level": 17, "resolution": 0.0000053644180, "scale": 1127.233860239982 },
                { "level": 18, "resolution": 0.0000026822090, "scale": 563.6169301199912 },
                { "level": 19, "resolution": 0.0000013411045, "scale": 281.8084650599956 }
    ];
    var startExtent = new esri.geometry.Extent(106.6543, 34.7099, 107.7474, 34.1017, new esri.SpatialReference({ wkid: 4326 }));;
    /*
    urlUtils.addProxyRule({
        urlPrefix: "route.arcgis.com",  
        proxyUrl: "/sproxy/"
        });
        */

    if (isUseProxy) {
        esri.config.defaults.io.proxyUrl = myProxyUrl;
        esri.config.defaults.io.alwaysUseProxy = isAlwaysUseProxy;
    }

    //esri.addProxyRule({urlPrefix: "http://route.arcgis.com", proxyUrl:"http:////proxy.ashx”});

    http://192.168.0.106:6088/proxy.ashx
    //esriConfig.defaults.map.slider = { right:"10px", top:"200px"}; //, width:"200px", height:null 
        map = new esri.Map("map", {
            slider: true,
            sliderPosition: "bottom-right", //bottom-left //top-right
            sliderStyle: "small", //large small
            //extent: startExtent,
            logo: false,
            //lods: mylods, //动态图需要设置 瓦片图不需要设置 否则不可见
            zoom: 6,
            minZoom: 2
        });

    //map.addLayer(layer); //将地图加入到地图中

    if (layer.loaded) {
        buildLayerList(layer);
    } else {
        dojo.connect(layer, "onLoad", buildLayerList);
    }

    navToolbar = new esri.toolbars.Navigation(map);

    toolbar = new esri.toolbars.Draw(map);  // esri.toolbars.Draw(map, options)  创建选择工具

    distancetool = new esri.toolbars.Draw(map);//创建绘图工具

    dojo.connect(toolbar, "onDrawEnd", addToMap);   // 绘制完成触发  选择工具

    //distancetool.on("draw-end", dojo.lang.hitch(map, getAreaAndLength)); //测距工具绘图完毕 liyafei
    distancetool.on("draw-end", getAreaAndLength); //测距工具绘图完毕

    

    if (routedLine) {
        //routeTask = new RouteTask(routeServiceURL); //初始化路由服务    
    }

    //地图比例尺工具
    var scalebar = new esri.dijit.Scalebar({
        map: map,
        scalebarStyle: "line",       //"ruler",
        scalebarUnit: "metric" //"dual","english","metric"
    });

    //设置地图默认初始化位置
    var location = new esri.geometry.Point(107.2015, 34.3426,new esri.SpatialReference({ wkid: 4326 }));// map.spatialReference)
    map.centerAndZoom(location,6); //centerAt(mapPoint) centerAndZoom
    map.setScale(600000);
    //map.setZoom(2);
    //map.setExtent(startExtent, true);
    //地图加载完毕初始化地图和选择图元工具

    map.on("load", mapLoaded);
    function mapLoaded() {
        createGraphicsMenu(); //初始化选择框右键
        createMapMenu(); //初始化地图右键
    }
    
    dicsymbol = new Array(); //图元样式字典

    //初始化样式信息
    closeSymbol1 = new esri.symbol.PictureMarkerSymbol("img/map/carTrackClose1.png", 22, 28);
    closeSymbol2 = new esri.symbol.PictureMarkerSymbol("img/map/carTrackClose2.png", 22, 28);
    closeSymbol3 = new esri.symbol.PictureMarkerSymbol("img/map/carTrackClose3.png", 22, 28);
    carNOBKSymbol = new esri.symbol.PictureMarkerSymbol("img/map/carbkdef.png", 152, 30);
    carNOBKSymbolSel = new esri.symbol.PictureMarkerSymbol("img/map/carbksel.png", 152, 30);

    //navToolbar.setZoomSymbol(closeSymbol1);

    closeSelSymbol = new esri.symbol.PictureMarkerSymbol("img/map/dissel.png", 16, 16);
    //closeSelSymbol=new PictureMarkerSymbol("img/map/dissel2.png", 10, 10);

    //默认地图样式 api中不需要关注
    defaultsymbol = new esri.symbol.PictureMarkerSymbol("img/camera.png", 16, 16);
    psymbol = new esri.symbol.PictureMarkerSymbol("img/camera.png", 16, 16);
    pselsymbol = new esri.symbol.PictureMarkerSymbol("img/camera_go.png", 16, 16);
    selectzonesymbol = new esri.symbol.SimpleFillSymbol(
                esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(
                    esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
                    new dojo.Color([0, 0, 255]),
                    2
                ),
                new dojo.Color([255, 0, 255, 0.25])
                );
    defaultzonesymbol = new esri.symbol.SimpleFillSymbol(
                esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                new esri.symbol.SimpleLineSymbol(
                    esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
                    new dojo.Color([255, 0, 0]),
                    2
                ),
                new dojo.Color([255, 255, 0, 0.25])
            );
    defaultlinesymbol = new esri.symbol.SimpleLineSymbol(
            esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
            new dojo.Color([0, 0, 255]),
            2
        );


    //卡口样式默认样式
    commonSymbol_1 = new esri.symbol.PictureMarkerSymbol("img/map/点位-小-1.png", 16, 21); //默认
    commonSymbol_2 = new esri.symbol.PictureMarkerSymbol("img/map/点位-小-2.png", 16, 21); //鼠标滑过
    commonSymbol_3 = new esri.symbol.PictureMarkerSymbol("img/map/点位-小-3.png", 16, 21); //鼠标点击后

    //卡口样式选择样式
    selectedSymbol_1 = new esri.symbol.PictureMarkerSymbol("img/map/点位-中-1.png", 32, 45); //默认
    selectedSymbol_2 = new esri.symbol.PictureMarkerSymbol("img/map/点位-中-2.png", 32, 45); //鼠标滑过
    selectedSymbol_3 = new esri.symbol.PictureMarkerSymbol("img/map/点位-中-3.png", 32, 45); //鼠标点击

    //轨迹点样式
    selTrackPointSymbol_1 = new esri.symbol.PictureMarkerSymbol("img/map/路径-点位-中-1.png", 32, 45); //默认
    selTrackPointSymbol_2 = new esri.symbol.PictureMarkerSymbol("img/map/路径-点位-中-2.png", 32, 45); //默认
    selTrackPointSymbol_3 = new esri.symbol.PictureMarkerSymbol("img/map/路径-点位-中-3.png", 32, 45); //默认

    //初始化颜色字典
    dicColors = new Array(new esri.Color([69, 187, 255, 0.8]), new esri.Color([25, 237, 170, 0.8]), new esri.Color([209, 143, 255, 0.8]), new esri.Color([166, 223, 11, 0.8]));
    dicCarNOColors = new Array(new esri.Color([69, 187, 255]), new esri.Color([25, 237, 170]), new esri.Color([209, 143, 255]), new esri.Color([166, 223, 11]));
    selTracLineColor = new esri.Color([255, 84, 0]); //选中的线颜色
    selCarNoColor = new esri.Color([255, 255, 255]); //选中的车牌颜色

    trackLineLayer = new esri.layers.GraphicsLayer("TrackLineLayer");    //轨迹图层
    trackPointLayer = new esri.layers.GraphicsLayer("TrackPointLayer");   //轨迹点图层
    historyPointLayer = new esri.layers.GraphicsLayer("HistoryPointLayer");

    closeSelLayer = new esri.layers.GraphicsLayer("CloseSelLayer"); // 关闭图元选中所在图层

    var bayonetInfoTemplate = new esri.InfoTemplate();
    bayonetInfoTemplate.setTitle("<b>${name}</b>"); //"<b>${name}</b>"

    var strTableTimes = "";
    strTableTimes += "<table class=\"l-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    strTableTimes += "<tr><th>属性</th><th>值</th></tr>"
    strTableTimes += "<tr><td>编号</td><td>${id}</td></tr>";
    strTableTimes += "<tr><td>代号</td><td>${code}</td></tr>";
    strTableTimes += "<tr><td>名称</td><td>${name}</td></tr>";
    strTableTimes += "<tr><td>IP</td><td>${ipaddress}</td></tr>";
    strTableTimes += "<tr><td>状态</td><td>${state}</td></tr>";
    strTableTimes += "<tr><td>描述</td><td>${desc}</td></tr>";
    strTableTimes += "</table>"

    bayonetInfoTemplate.setContent("<span>" + strTableTimes + "</span>");

    ////bayonetInfoTemplate.setContent("<span>编号:${id}</span></br><span>代号:${code}</span></br><span>名称:${name}</span></br><span>IP:${ipaddress}</span></br><span>状态:${state}</span></br><span>描述:${desc}</span></br><img src=\"img/rosette.png\"  alt=\"${name}\" />");
    //bayonetLayer = new esri.layers.GraphicsLayer("BayonetLayer", { infoTemplate: bayonetInfoTemplate });       //卡口图层 

    ////鼠标移动到图元上触发API
    //bayonetLayer.on("mouse-over", function (evt) {
    //    //var message="名称:"+evt.graphic.attributes["name"];
    //    //alert(evt.graphic.attributes["name"]);
    //    //showToolTip(evt,evt.graphic.attributes["name"]);

    //    if (bayonetSelected(evt.graphic)) {
    //        //选中状态
    //        evt.graphic.setSymbol(selectedSymbol_2);
    //    }
    //    else {
    //        //未选中状态
    //        evt.graphic.setSymbol(commonSymbol_2);
    //    }
    //    bayonetLayer.redraw();
    //    callcshar("PointMouseAbove", evt.graphic.attributes["id"]);
    //});
    ////鼠标离开图元 触发api
    //bayonetLayer.on("mouse-out", function (evt) {
    //    //hideToolTip();
    //    if (bayonetSelected(evt.graphic)) {
    //        //选中状态
    //        if (evt.graphic == graphicSelected) {
    //            evt.graphic.setSymbol(selectedSymbol_3);
    //        }
    //        else {
    //            evt.graphic.setSymbol(selectedSymbol_1);
    //        }
    //    }
    //    else {
    //        //未选中状态
    //        if (evt.graphic == graphicSelected) {
    //            evt.graphic.setSymbol(commonSymbol_3);
    //        }
    //        else {
    //            evt.graphic.setSymbol(commonSymbol_1);
    //        }
    //    }

    //    bayonetLayer.redraw();
    //    callcshar("PointMouseLeave", evt.graphic.attributes["id"]);
    //    //alert("out");
    //});

    //bayonetLayer.on("mouse-down", function (evt) {
    //    //hideToolTip();
    //    graphicSelected = evt.graphic;
    //    //evt.graphic.Symbol=commonSymbol_3;

    //    if (bayonetSelected(evt.graphic)) {
    //        //选中状态
    //        evt.graphic.setSymbol(selectedSymbol_3);
    //    }
    //    else {
    //        //未选中状态
    //        evt.graphic.setSymbol(commonSymbol_3);
    //    }

    //    for (var i = 0; i < bayonetLayer.graphics.length; i++) {
    //        if (bayonetLayer.graphics[i] == evt.graphic) {

    //        }
    //        else {
    //            if (bayonetSelected(bayonetLayer.graphics[i])) {
    //                bayonetLayer.graphics[i].setSymbol(selectedSymbol_1);
    //            }
    //            else {
    //                bayonetLayer.graphics[i].setSymbol(commonSymbol_1);
    //            }
    //        }
    //    }
    //    evt.graphic.show();
    //    bayonetLayer.redraw();
    //});
    closeSelLayer.on("mouse-over", function (evt) {
        //alert("in");
    });
    closeSelLayer.on("mouse-down", function (evt) {
        //alert(evt.graphic.attributes["id"]);
        //查询图元
        var gBayonet = getBayonet(evt.graphic.attributes["code"]);

        //修改状态
        if (gBayonet) {
            if (gBayonet == graphicSelected) {
                gBayonet.setSymbol(commonSymbol_3);
            }
            else {
                gBayonet.setSymbol(commonSymbol_1);
            }
            //bayonetLayer.redraw();
            //删除当前按钮
            if (selectedGraphics) {
                for (var j = selectedGraphics.length - 1; j >= 0; j--) {
                    if (selectedGraphics[j].attributes["code"] == gBayonet.attributes["code"]) {
                        selectedGraphics.remove(j);
                    }
                }
            }
            closeSelLayer.remove(evt.graphic);
        }
    });

    trackPointLayer.on("mouse-over", function (evt) {
        if (evt.graphic.attributes["canclose"] == 1) {
            evt.graphic.setSymbol(closeSymbol2.setOffset(145, 0));
        }
        else {
            if (evt.graphic.attributes["type"] == "tkpoint") {
                evt.graphic.setSymbol(selTrackPointSymbol_2);
            }

        }
        //evt.graphic.setSymbol(commonSymbol_1);
        trackPointLayer.redraw();
    });

    trackPointLayer.on("mouse-out", function (evt) {
        if (evt.graphic.attributes["canclose"] == 1) {
            evt.graphic.setSymbol(closeSymbol1.setOffset(145, 0));
        }
        else {
            if (evt.graphic.attributes["type"] == "tkpoint") {
                evt.graphic.setSymbol(selTrackPointSymbol_1);
            }
        }
        trackPointLayer.redraw();
    });

    trackPointLayer.on("mouse-up", function (evt) {
        if (evt.graphic.attributes["canclose"] == 1) {
            evt.graphic.setSymbol(closeSymbol1.setOffset(145, 0));
        }
        else {
            if (evt.graphic.attributes["type"] == "tkpoint") {
                evt.graphic.setSymbol(selTrackPointSymbol_1);
            }

        }
    });

    trackLineLayer.on("mouse-down", function (evt) {
        if (evt.graphic.attributes["type"] == "line") {
            SelectTrackLine(evt.graphic.attributes["id"]); //点击的是线路则高亮线路 高亮线路
        }

    })

    trackPointLayer.on("mouse-down", function (evt) {
        //gpoint.attributes["id"]=1;
        //gpoint.attributes["canclose"]=1;
        if (evt.graphic.attributes["canclose"] == 1) {
            evt.graphic.setSymbol(closeSymbol3.setOffset(145, 0));

            /*删除老方法
            for(var j=trackLineLayer.graphics.length-1;j>=0;j--)
            {
                if(trackLineLayer.graphics[j].attributes["id"]==evt.graphic.attributes["id"])
                {
                    trackLineLayer.remove(trackLineLayer.graphics[j])
                }        
            }
            
            for(var j=trackPointLayer.graphics.length-1;j>=0;j--)
            {
                if(trackPointLayer.graphics[j].attributes["id"]==evt.graphic.attributes["id"])
                {
                    trackPointLayer.remove(trackPointLayer.graphics[j])
                }        
            }
            */

            //删除新方法
            ResetSetColorIndex(evt.graphic.attributes["id"]); //清除颜色占用供其他使用
            var trackid = evt.graphic.attributes["id"];
            if (trackid) {
                DelTrack(trackid);
            }

            //ar colorIndex=GetColorIndex("ccc");
            //alert(colorIndex);
        }
        else {


            if (evt.graphic.attributes["type"] == "tkpoint") {
                evt.graphic.setSymbol(selTrackPointSymbol_3);
                //liyafei 需要调用c#接口进行数据传输哦
                //evt.graphic.attributes["name"]="调用c#传回";

                //evt.graphic.attributes["times"]=arrTimes;
                //evt.graphic.setInfoTemplate(template);

                //map.infoWindow.show();
                //alert("hello");
            }
            else {
                SelectTrackLine(evt.graphic.attributes["id"]); //高亮线路
            }

            //evt.graphic.show();
            //trackPointLayer.remove(evt.graphic);
            //trackLineLayer.add(evt.graphic);
            //SelectTrackLine("99");
        }
    })


    //bayonetLayer.on("mouse-up", function (evt) {
    //    //hideToolTip();
    //    //evt.graphic.setSymbol(commonSymbol_1);
    //    //bayonetLayer.redraw();
    //});

    trackLineLayer.on("mouse-down", function (evt) {
        evt.graphic.show();
    })

    map.addLayer(trackLineLayer);
    //map.addLayer(bayonetLayer);
    map.addLayer(trackPointLayer);
    //map.addLayer(closeSelLayer);
    map.addLayer(historyPointLayer);

    //dojo.connect(map, "onLoad", createToolbar); // 绑定加载事件  

    popupOptions = {
        "markerSymbol": new esri.symbol.SimpleMarkerSymbol("circle", 20, null, new esri.Color([0, 0, 0, 0.25])),
        "marginLeft": "20",
        "marginTop": "20"
    };


    //dojo.connect(map, "onLoad",mapLoaded);

    //鼠标移动时在地图左下角显示x(纵坐标),y(横坐标)值
    map.on("mouse-move", mapMouseMove);
    function mapMouseMove(mapEvent) {
        try {
            var pt = mapEvent.mapPoint;
            require(["dojo/dom"], function (dom) {
                dom.byId("currentxy").innerText = "X:" + pt.x.toFixed(4) + " Y:" + pt.y.toFixed(4);
            });
        }
        catch (err)
        { }
    }

    //GeometryService 创建地理服务（需要在arcgis开启此项服务）
    geometryService = new esri.tasks.GeometryService(geoServiceURL);
    geometryService.on("areas-and-lengths-complete", outputAreaAndsLength); //测量面积结束事件
    //geometryService.on("onLengthsComplete", outputDistance);
    dojo.connect(geometryService, "onLengthsComplete", outputDistance);//测量长度结束事件

    var dtype = 0; // 1 测面积 其他 测距
    function getAreaAndLength(evtObj) {
        //var map = this;
        var geometry = evtObj.geometry; //取得当前几何体体
        distancetool.deactivate();
        map.showZoomSlider();
        var graphic;

        if (geometry.type == "polyline") {
            //测距
            dtype = 0;

            //将几何体添加到地图
            graphic = map.graphics.add(new esri.Graphic(geometry, defaultlinesymbol));

            //设置测量参数 测量长度
            var lengthParams = new esri.tasks.LengthsParameters();
            lengthParams.polylines = [geometry];
            lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
            lengthParams.geodesic = true;
            geometryService.lengths(lengthParams);

        }
        else if (geometry.type == "polygon") {
            //测量面积
            dtype = 1;

            //将几何体添加到地图
            graphic = map.graphics.add(new esri.Graphic(geometry,
                new esri.symbol.SimpleFillSymbol()));

            //设置测量参数 测量面积
            var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
            areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
            areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_SQUARE_METERS;
            areasAndLengthParams.calculationType = "geodesic";
            geometryService.simplify([geometry],
                function (simplifiedGeometries) {
                    areasAndLengthParams.polygons = simplifiedGeometries;
                    geometryService.areasAndLengths(areasAndLengthParams);
                });
        }
        else {
            console.log("不能识别的测量类型！");
        }
    }

    //输出面积函数
    function outputAreaAndsLength(evtObj) {
        //取得测量结果
        var result = evtObj.result;
        var r; //输出信息
        if (dtype == 1) {
            //输出面积

            if (result.areas[0] > 1000000) {
                r = (result.areas[0] / 1000000).toFixed(2) + "平方千米";
            }
            else {
                r = result.areas[0].toFixed(2) + "平方米";
            }
            //alert(r);
        }
        else {
            //无用
            //alert(result.lengths[0].toFixed(2)+"米");

            if (result.lengths[0] > 1000) {
                r = (result.lengths[0] / 1000).toFixed(2) + "千米";
            }
            else {
                r = result.lengths[0].toFixed(2) + "米";
            }
            //alert(r);
        }

        artDialog({ content: r, lock: true });
        //distancetool.deactivate();
    }

    //取得测量长度结果
    function outputDistance(result) {
        var r;
        if (result.lengths[0] > 1000) {
            r = (result.lengths[0] / 1000).toFixed(2) + "千米";
        }
        else {
            r = result.lengths[0].toFixed(2) + "米";
        }
        //alert(r);
        artDialog({ content: r, lock: true });
        //distancetool.deactivate();
    }

    //将选择框几何体添加到地图中
    function addToMap(geometry) {
        if (geometry.type === "point" || geometry.type === "multipoint") {
            //点缓冲
            //缓存完毕后根据缓冲出来的多边形进行选择
            console.log(selectType+":point select");

            //var graphic = new esri.Graphic(geometry);
            doBuffer(geometry);
        }
        else if (geometry.type == "polyline" || geometry.type == "line") {
            //计算缓冲面
            //缓存完毕后根据缓冲出来的多边形进行选择
            console.log(selectType + ":line select");
            //var graphic = new esri.Graphic(geometry);
            doBuffer(geometry);
        }
        else if (geometry.type == "polygon") {
            console.log(selectType + ":polygon select");
            SelectByGeometry(geometry);
        }

        

        ////旧的方式 不使用啦
        //toolbar.deactivate();  // 关闭工具栏并激活地图导航.  
        //map.showZoomSlider();  //在地图上显示的缩放滑块  
        //// 判断几何图形的类型 
        //var graphic = new esri.Graphic(geometry,
        //    defaultzonesymbol, { "id": selzoneindex });
        //var sid = selzoneindex;
        ////选中
        //var icout = 0;
        //var itemsstring = "";
        //selectedGraphics = [];
        //var objects = bayonetLayer._clusterData;

        

        //for (var i = 0; i < objects.length; i++) {
        //    var latlng = new esri.geometry.Point(parseFloat(objects[i].x), parseFloat(objects[i].y), map.spatialReference);
        //    var webMercator;
        //    require(["esri/geometry/webMercatorUtils"], function (webMercatorUtils) {
        //        webMercator = webMercatorUtils.webMercatorToGeographic(latlng);
        //    });

        //    var pt = new esri.geometry.Point(webMercator.x, webMercator.y, map.spatialReference);
        //    if (graphic.geometry.contains(pt)) {
        //        console.log(i + "：" +objects[i].attributes.id);
        //    }
        //}
        //if (icout > 0) {
        //    bayonetLayer.redraw();
        //    console.log("选中结果：" + icout);
        //}
    }

    function doBuffer(geometry) {
        require([
       "esri/tasks/BufferParameters", "esri/SpatialReference", "dojo/dom",
       "esri/tasks/GeometryService"
        ], function (BufferParameters, SpatialReference, dom, GeometryService) {
            var params = new BufferParameters();
            params.geometries = [geometry];

            params.distances = [bufferDistance];
            //params.unit =GeometryService.UNIT_METER;//esri.tasks.GeometryService.UNIT_KILOMETER; //如果是经纬度 就不能增加单位
            params.outSpatialReference = map.spatialReference;

            params.bufferSpatialReference = new SpatialReference({ wkid: 4326 });
            var gsvc = new GeometryService(geoServiceURL);
            gsvc.buffer(params, showBuffer);
        });
    }

    function showBuffer(geometries) {
        console.log(geometries.length);
        SelectByGeometry(geometries[0]);
    }

    //将选择框几何体添加到地图中
    function SelectByGeometry(geometry) {
        toolbar.deactivate();  // 关闭工具栏并激活地图导航.  
        map.showZoomSlider();  //在地图上显示的缩放滑块  
        // 判断几何图形的类型 
        var graphic = new esri.Graphic(geometry,
            defaultzonesymbol, { "id": selzoneindex });
        var sid = selzoneindex;
        //选中
        var icout = 0; 
        var itemsstring = "";
        selectedGraphics = [];
        var objects;
        if (selectType == "bayonet")
        {
            if (bayonetLayer)
            {
                objects = bayonetLayer._clusterData;
            }
            
        } else if (selectType == "video")
        {
            if (videoLayer)
            {
                objects = videoLayer._clusterData;
            }
        }
        if (!objects)
        {
            return;
        }

        console.log(new Date() + "本次选择----------------------------------------");
        var tempstr;
        for (var i = 0; i < objects.length; i++) {
            var latlng = new esri.geometry.Point(parseFloat(objects[i].x), parseFloat(objects[i].y), map.spatialReference);
            var webMercator;
            require(["esri/geometry/webMercatorUtils"], function (webMercatorUtils) {
                webMercator =  webMercatorUtils.webMercatorToGeographic(latlng);
            });

            var pt = new esri.geometry.Point(webMercator.x, webMercator.y, map.spatialReference);
            if (graphic.geometry.contains(pt)) {
                console.log(i + "：" + objects[i].attributes.name);
                icout++;
                if (tempstr)
                {
                    tempstr +=","+objects[i].attributes.name;
                }
                else
                {
                    tempstr = objects[i].attributes.name;
                }
            }
        }
        if (icout > 0) {
            //bayonetLayer.redraw();
            map.graphics.clear();
            map.graphics.add(graphic);
            console.log("选中结果：" + icout);
            artDialog({ content: "选中结果:" + tempstr, lock: true });
        }
        else
        {
            artDialog({ content: "选中结果为空!", lock: true });
            console.log("选中结果为空！");
        }
    }

    require(["dojo/dom", "dojo/on"], function (dom, on) {
        //前一视图
        on(dom.byId("PrevExtent"), "click", function () {
            navToolbar.zoomToPrevExtent();
        });

        //下一视图
        on(dom.byId("NextExtent"), "click", function () {
            navToolbar.zoomToNextExtent();
        });

        ////矩形选择
        //on(dom.byId("extent"), "click", function () {

        //    ShowSelectBayonet();
        //    distancetool.deactivate();
        //    toolbar.activate(esri.toolbars.Draw.EXTENT);
        //    map.hideZoomSlider();
        //});
        ///*
        ////多边形
        //on(dom.byId("polygon"), "click", function(){ 
        //    distancetool.deactivate();
        //    toolbar.activate(esri.toolbars.Draw.POLYGON);
        //    map.hideZoomSlider();
        //}); 
        //*/
        ////手绘多面体
        //on(dom.byId("handdraw"), "click", function () {
        //    distancetool.deactivate();
        //    toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
        //    map.hideZoomSlider();
        //});
        ////圆形
        //on(dom.byId("circle"), "click", function () {
        //    distancetool.deactivate();
        //    toolbar.activate(esri.toolbars.Draw.CIRCLE);
        //    map.hideZoomSlider();
        //});


        ////点选
        //on(dom.byId("near"), "click", function () {

        //    ShowDistanceConfig();

        //    distancetool.deactivate();
        //    toolbar.activate(esri.toolbars.Draw.POINT);
        //    map.hideZoomSlider();
        //});

        
        //点选
        on(dom.byId("bayonet"), "click", function () {
            //ShowDistanceConfig();
            selectType = "bayonet";
            if (selectWindo)
            {
                selectWindo.close();
            }
            ShowSelectWindo("卡口选择");
        });

        //点选
        on(dom.byId("video"), "click", function () {
            //ShowDistanceConfig();
            selectType = "video";
            if (selectWindo) {
                selectWindo.close();
            }
            ShowSelectWindo("视频选择");
        });

        

        ////线选
        //on(dom.byId("linenear"), "click", function () {
        //    ShowDistanceConfig();
        //    distancetool.deactivate();
        //    toolbar.activate(esri.toolbars.Draw.POLYLINE); //FREEHAND_POLYLINE
        //    map.hideZoomSlider();
        //});
        //near
        //line
        /*
        //椭圆
        on(dom.byId("ellipse"), "click", function(){
            distancetool.deactivate();
            toolbar.activate(esri.toolbars.Draw.ELLIPSE);
            map.hideZoomSlider();
        });
        */

        /* 
        //清除所有选项
        on(dom.byId("clearall"), "click", function(){
            toolbar.deactivate();
            distancetool.deactivate();
            ClearSelectedPoint(); //清除所有选择
        });
        */

        //测距
        on(dom.byId("distance"), "click", function () {
            toolbar.deactivate();
            distancetool.activate(esri.toolbars.Draw.POLYLINE);
            map.hideZoomSlider();
        });

        //测面积
        on(dom.byId("area"), "click", function () {
            toolbar.deactivate();
            distancetool.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
            map.hideZoomSlider();
        });

        
        // 图层控制 layercontrol
        on(dom.byId("layercontrol"), "click", function () {
            ShowLayerControl();
        });

        //打印
        on(dom.byId("print"), "click", function () {
            //callcshar("MapPrint", null);
            window.print();
        });


        //全屏
        on(dom.byId("fullscreen"), "click", function () {
            //callcshar("FullScreen", null);
            try {
                var el = document.documentElement;
                var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
                if (typeof rfs != "undefined" && rfs) {
                    rfs.call(el);
                } else if (typeof window.ActiveXObject != "undefined") {
                    var wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            }
            catch (e) {
                console.log("Error:"+e.message);
            }
            

            //if (fullscreened)
            //{
            //    exitFull();
            //    fullscreened = false;
            //}
            //else
            //{
            //    var el = document.documentElement;
            //    var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
            //    if (typeof rfs != "undefined" && rfs) {
            //        rfs.call(el);
            //    } else if (typeof window.ActiveXObject != "undefined") {
            //        var wscript = new ActiveXObject("WScript.Shell");
            //        if (wscript != null) {
            //            wscript.SendKeys("{F11}");
            //        }
            //    }
            //    fullscreened = true;
            //}
            
            //if (fullscreened)
            //{
            //    exitFull();
            //}
            //else
            //{
            //    requestFullScreen($("ContentPannel"));
            //}
        });
    });

    //调用测试接口
    if (showTestData) {

        addVideoClusters();
        addBayonetClusters();
        
        //Tests();
    }

    //显示鹰眼地图
    //ShowOverviewMap();
    try {
        var overviewLayer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl); //动态地图地址
        require(["esri/dijit/OverviewMap"], function (OverviewMap) {
            var overviewMapDijit = new OverviewMap({
                map: map,
                baseLayer: overviewLayer,
                attachTo: "top-left", //"bottom-right"
                visible: false,
                //color: " #D84E13",
                opacity: .40
            });
            overviewMapDijit.startup();
        });
    }
    catch (e)
    {
        console.log("Error:"+e.message);
    }
    
    


    /*
    //显示 home按钮
    var home = new esri.dijit.HomeButton({
        map: map
        }, "HomeButton");
        home.startup();
    */
    //callcshar("MapLoadCompleted", null);

    //document.getElementById("map_graphics_layer").style('display: none;');

    

    //map.on("click", doBuffer);
}

dojo.addOnLoad(InitMap);

var fullscreened = false;
function requestFullScreen(element) {
    // 判断各种浏览器，找到正确的方法
    var requestMethod = element.requestFullScreen || //W3C
    element.webkitRequestFullScreen ||    //Chrome等
    element.mozRequestFullScreen || //FireFox
    element.msRequestFullScreen; //IE11
    if (requestMethod) {
        requestMethod.call(element);
    }
    else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

//退出全屏 判断浏览器种类
function exitFull() {
    // 判断各种浏览器，找到正确的方法
    var exitMethod = document.exitFullscreen || //W3C
    document.mozCancelFullScreen ||    //Chrome等
    document.webkitExitFullscreen || //FireFox
    document.webkitExitFullscreen; //IE11
    if (exitMethod) {
        exitMethod.call(document);
    }
    else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

//显示鹰眼地图
function ShowOverviewMap() {
    var overviewMapDijit = new esri.dijit.OverviewMap({
        map: map,
        attachTo: "top-left", //"bottom-right"
        visible: false,
        color: " #D84E13",
        opacity: .40
    });
    overviewMapDijit.startup();
}
/*
function showDia(){ 
pane=document.createElement("map_window"); 
pane.setAttribute("id","diaDiv"); 
pane.innerHTML="<a herf=\"http://www.bing.com\">Hello </a>"
document.body.appendChild(pane); 
var dia=new dijit.Dialog({title:"测试一下"},pane); 
dia.show(); 
} 
*/

//测试函数
function Tests() {
    //alert(esri.geometry.scaleUtils.getScale(map));
    //alert( "设置范围"+SetAera(TestAreaInfo)) ;

    //SetStyles(TestStylesInfo);  //测试样式设置

    PointShow(pointinfo2);
    ShowTrack(trackInfo2);
    ShowTrack(trackInfo3);
    ShowHistoryPoint(historyPoint);
    //alert(GetScreenBayonet());

    //DelTrackAll();//清除所有轨迹
    //ShowTrack(trackInfo2);
    //ShowTrack(trackInfo3);

    //TestTextSymbol();
    /*
    PointShow(TestPointInfo);
    ShowTrack(TestTrackInfo); //TestTrackInfo TestPointInfo
    ShowTrack(TestTrackInfo2);
    */
    //ShowTrack(TestTrackInfo3);
    //添加点接口
    //SetPoint(TestChagePointInfo); //点位选中
    //UnSetPoint(TestChagePointInfo); //取消点位选中

    //SetAera(TestAreaInfo); //设置区域接口
}
//插入点接口
function PointShow(PointInfo) {
    var pointsJson = eval('(' + PointInfo + ')');
    map.infoWindow.resize(300, 200);
    var csymbol = commonSymbol_1;
    var items = pointsJson.items;
    for (var i = 0; i < items.length; i++) {
        var pt = new esri.geometry.Point(items[i].X, items[i].Y, map.spatialReference);
        var gpoint = new esri.Graphic(pt, csymbol, items[i]); // items[i]//new esri.symbol.PictureMarkerSymbol("img/rosette.png", 16, 16)
        bayonetLayer.add(gpoint);
    }
    bayonetLayer.redraw();
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}


//现实历史纪录
function ShowHistoryPoint(HistroyPoint) {
    //var hispoint=eval(HistroyPoint);

    var hispoint = eval('(' + HistroyPoint + ')');
    //清除旧的
    map.infoWindow.hide();
    historyPointLayer.clear();

    var gp = getBayonet(hispoint.bayonetcode);
    if (gp) {

        /*
        var historyTemplate = new esri.InfoTemplate();
        historyTemplate.setTitle("<b>${bayonetcode}</b>"); //"<b>${name}</b>"
        historyTemplate.setContent("<span>卡口代号:${bayonetcode}</span></br><span>卡口名称:${bayonetname}</span></br><span>车牌号:${carno}</span></br><span>车道:${lane}</span></br><span>方向:${direction}</span></br><a href=\"" + hispoint.picurl + "\" target=\"_blank\"><img src=\"" + hispoint.picurl + "\"  height=\"170\" width=\"260\"></a>");
        var histoyrsymbol = new esri.symbol.PictureMarkerSymbol(hispoint.picurl, 150, 100);
        var pt = new esri.geometry.Point(gp.geometry.x, gp.geometry.y, map.spatialReference);
        var gpoint = new esri.Graphic(pt, histoyrsymbol, hispoint); // items[i]//new esri.symbol.PictureMarkerSymbol("img/rosette.png", 16, 16)
        gpoint.setAttributes({ "bayonetcode": hispoint.bayonetcode, "bayonetname": hispoint.bayonetname, "carno": hispoint.carno, "lane": hispoint.lane, "direction": hispoint.direction, "picurl": hispoint.picurl });
        gpoint.infoTemplate = historyTemplate;
        historyPointLayer.add(gpoint);
        map.centerAt(pt);
        */

        ///* 调不通不知道为啥
        map.infoWindow.setTitle("<b>" + gp.attributes["name"] + "</b>");
        map.infoWindow.setContent("<span>卡口代号:" + gp.attributes["code"] + "</span></br><span>卡口名称:" + gp.attributes["name"] + "</span></br><span>车牌号:" + hispoint.carno + "</span></br><span>车道:" + hispoint.lane + "</span></br><span>方向:" + hispoint.direction + "</span></br><a href=\"" + hispoint.picurl + "\" target=\"_blank\"><img src=\"" + hispoint.picurl + "\"  height=\"170\" width=\"260\"></a>");
        var screenpoint=map.toScreen(gp.geometry);
        map.infoWindow.show(screenpoint); 
        //*/
    }
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//显示信息
function ShowInfoWindow(title, content) {
    map.infoWindow.setTitle(title);
    map.infoWindow.setContent(content);
    var screenpoint = map.extent.getCenter();
    map.infoWindow.show(screenpoint);
}

//绘制轨迹
function ShowTrack(TrackInfo) {
    var trackinfoJson = eval('(' + TrackInfo + ')');
    var trackid = trackinfoJson.id;
    var strCarNo = trackinfoJson.carno;
    var colorIndex = GetColorIndex(trackid);
    //alert(colorIndex);
    if (colorIndex == -1) {
        artDialog({ content: "轨迹数量超过最大可显示数量!", lock: true });
        return "{\"returncode\":1,\"reason\":\"轨迹数量超过最大可显示数量\"}";
    }
    else {
        var line = new esri.geometry.Polyline(map.spatialReference);

        var points = new Array();
        var gp; //用于保存最后一个点

        //slsTrackStyle=slsTrackStyle.setColor(GetLineColor(trackid));
        //初始化样式
        var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                                new esri.Color([0, 255, 0]),
                                2
                        );

        var style = lineSymbol.setColor(GetLineColor(trackid)).setWidth(2);

        var arrayPoint = new Array();
        for (var i = 0; i < trackinfoJson.bayonets.length; i++) {
            gp = getBayonet(trackinfoJson.bayonets[i].id);
            if (gp) {
                var ptemp = new esri.geometry.Point(gp.geometry.x, gp.geometry.y, map.spatialReference);
                points.push(ptemp);
                arrayPoint.push(gp);
            }
        }

        //var linenode={};
        //linenode.id=trackid;
        //linenode.points=arrayPoint;
        //dicLineNode.push(linenode);

        if (points.length < 2) {
            ResetSetColorIndex(trackid);
            artDialog({ content: "有效轨迹点数量不足！", lock: true });
            return "{\"returncode\":1,\"reason\":\"轨迹点数量不足！\"}";
        }

        dicLineNode[trackid] = arrayPoint;
        dicTrackLineJason[trackid] = trackinfoJson;
        line.addPath(points);

        function addline() //直连线路
        {
            var lineGraphic = new esri.Graphic(line, style);
            lineGraphic.setAttributes({ "id": trackid, "type": "line" });
            trackLineLayer.add(lineGraphic);
        }


        //判断是否启用路径
        if (routedLine) {
            //setup the route //参数
            var routeParams; //路由参数
            var stopSymbol;
            var routeTask;

            routeTask = new esri.tasks.RouteTask(routeServiceURL); //初始化路由服务   
            stopSymbol = new esri.symbol.SimpleMarkerSymbol().setStyle(esri.symbol.SimpleMarkerSymbol.STYLE_CROSS).setSize(1);
            routeParams = new esri.tasks.RouteParameters();
            routeParams.stops = new esri.tasks.FeatureSet();


            routeParams.outSpatialReference = map.spatialReference;

            routeTask.on("solve-complete", function (evt) {
                var lineGraphic = evt.result.routeResults[0].route.setSymbol(style);
                var tid = trackid;
                lineGraphic.setAttributes({ "id": tid, "type": "line" });//trackid
                trackLineLayer.add(lineGraphic);
            });

            routeTask.on("error", function (evt) {
                addline();
            });

            //多个点一起提交计算路径
            for (var i = 0; i < points.length; i++) {
                var stop = new esri.Graphic(points[i], stopSymbol);
                routeParams.stops.features.push(stop);
            }
            routeTask.solve(routeParams);

            /* 逐段提交方式
            for(var i=0;i<points.length-1;i++)
            {
                var stop0= new esri.Graphic(points[i], stopSymbol);
                var stop1= new esri.Graphic(points[i+1], stopSymbol);
                routeParams.stops.features.push(stop0);
                routeParams.stops.features.push(stop1);
                routeTask.solve(routeParams);
            }
            */

            //将最短路径的计算结果添加到地图上
            function showRoute(evt) {
                //map.graphics.add(evt.result.routeResults[0].route.setSymbol(style));
                var lineGraphic = evt.result.routeResults[0].route.setSymbol(style);
                var tid = routeParams.attributeParameterValues[0].value;
                lineGraphic.setAttributes({ "id": tid, "type": "line" });//trackid
                trackLineLayer.add(lineGraphic);
            }

            //计算最短路径出错，改用直接连接方式
            function errorHandler(err) {
                //alert("An error occured\n" + err.message + "\n" + err.details.join("\n"));
                //出错直连
                addline();
            }
        }
        else {
            //未启用最短路径方式连接轨迹则直接直连
            addline(); //直连轨迹            
        }

        //type- bk  车牌背景  cl 关闭 lb 标签 tkpoint 轨迹点
        //车牌 背景
        var ptbk = new esri.geometry.Point(gp.geometry.x, gp.geometry.y, map.spatialReference);
        var gpointbk = new esri.Graphic(ptbk, carNOBKSymbol.setOffset(80, 0)); // items[i]//new esri.symbol.PictureMarkerSymbol("img/rosette.png", 16, 16)
        gpointbk.setAttributes({ "id": trackid, "type": "bk" });
        trackPointLayer.add(gpointbk);

        //关闭图标 和标注
        var pt = new esri.geometry.Point(gp.geometry.x, gp.geometry.y, map.spatialReference);
        var gpoint = new esri.Graphic(pt, closeSymbol1.setOffset(145, 0)); // items[i]//new esri.symbol.PictureMarkerSymbol("img/rosette.png", 16, 16)
        gpoint.setAttributes({ "id": trackid, "canclose": 1, "type": "cl" });
        trackPointLayer.add(gpoint);

        //车号
        var font = new esri.symbol.Font();
        font.setSize("10pt");
        font.setFamily("微软雅黑");

        //文本标注
        var textSymbol = new esri.symbol.TextSymbol(strCarNo);  //strCarNo
        textSymbol.setColor(GetCarNoColor(trackid));
        textSymbol.setFont(font);
        textSymbol.setOffset(60, -4);
        var graphicText = esri.Graphic(pt, textSymbol); // ,null
        graphicText.setAttributes({ "id": trackid, "type": "lb" });
        //graphicText.setSymbol(textSymbol);
        trackPointLayer.add(graphicText);

        return "{\"returncode\":0,\"reason\":\"成功\"}";
    }


}

//删除轨迹信息
function DelTrack(trackid) {
    for (var j = trackLineLayer.graphics.length - 1; j >= 0; j--) {
        if (trackLineLayer.graphics[j].attributes["id"] == trackid) {
            trackLineLayer.remove(trackLineLayer.graphics[j])
        }
    }

    for (var j = trackPointLayer.graphics.length - 1; j >= 0; j--) {
        if (trackPointLayer.graphics[j].attributes["id"] == trackid) {
            trackPointLayer.remove(trackPointLayer.graphics[j])
        }
    }

    ResetSetColorIndex(trackid); //清除颜色占用供其他使用    
}

//清除所有轨迹信息
function DelTrackAll() {
    trackLineLayer.clear();
    trackPointLayer.clear();
    for (var i = 0; i < dicLineColors.length; i++) {
        dicLineColors[i] = strNull; //重置dicLineColors字典的键值为strNull
    }
}

function TestTextSymbol() {
    //车号
    var font = new esri.symbol.Font();
    font.setSize("36pt");
    font.setFamily("宋体");

    var pt = new esri.geometry.Point(108.8, 37.54, map.spatialReference);
    var textSymbol = new esri.symbol.TextSymbol("陕A8京93M3", font, GetCarNoColor(1));  //strCarNo
    //textSymbol.font.setDecoration(180);
    //textSymbol.angle=45;
    //textSymbol.setFont(font);
    //textSymbol.setColor(GetCarNoColor(1)); 
    //textSymbol.setFont(font); 
    //textSymbol.setOffset(60,-4); 
    var graphicText = new esri.Graphic(pt, textSymbol); // ,null
    graphicText.setAttributes({ "id": "ccccccc", "type": "lb", "canclose": 0 });
    //graphicText.setSymbol(textSymbol);
    //trackPointLayer.add(graphicText);
    trackPointLayer.add(graphicText);
    //map.graphics.add
}

//根据卡口ID取得卡口
function getBayonet(code) {
    for (var i = 0; i < bayonetLayer.graphics.length; i++) {
        if (bayonetLayer.graphics[i].attributes["code"] == code) {
            return bayonetLayer.graphics[i];
        }
    }
    return null;
}

function SelectTrackLine(id) {
    //修改选中的为选中样式 其他为模式样式

    //trackLineLayer //线路层样式修改
    for (var i = 0; i < trackLineLayer.graphics.length; i++) {
        var gp = trackLineLayer.graphics[i];
        var sid = gp.attributes["id"];
        if (gp.attributes["type"] == "line") {
            if (gp.attributes["id"] == id) {
                //选中样式
                gp.setSymbol(gp.symbol.setColor(selTracLineColor).setWidth(4));
                gp.show();
            }
            else {
                //非选中样式 
                gp.setSymbol(gp.symbol.setColor(GetLineColor(sid)).setWidth(2));
            }
        }


    }

    //trackPointLayer //轨迹标记层样式修改
    for (var i = 0; i < trackPointLayer.graphics.length; i++) {
        var gp = trackPointLayer.graphics[i];
        var sid = gp.attributes["id"];
        if (sid == id) {
            //车牌背景图片
            if (gp.attributes["type"] == "bk") {
                //选中
                gp.setSymbol(carNOBKSymbolSel.setOffset(80, 0));
            }
            //车牌号
            if (gp.attributes["type"] == "lb") {
                //选中
                gp.setSymbol(gp.symbol.setColor(selCarNoColor));
            }
        }
        else {
            //车牌背景图片
            if (gp.attributes["type"] == "bk") {
                //未选中
                gp.setSymbol(carNOBKSymbol.setOffset(80, 0));
            }

            //车牌号
            if (gp.attributes["type"] == "lb") {
                //未选中
                gp.setSymbol(gp.symbol.setColor(GetCarNoColor(sid)));
            }
        }
    }

    DrawTrackPoint(id);
}

//绘制历史信息点
function DrawTrackPoint(id) {
    //清除其他未选中的
    for (var i = trackPointLayer.graphics.length - 1; i >= 0; i--) {
        var gp = trackPointLayer.graphics[i];
        if (gp.attributes["type"] == "tkpoint" || gp.attributes["type"] == "pointno") {
            //选中
            trackPointLayer.remove(gp);
        }
    }
    //绘制新的
    var points = dicLineNode[id];
    var trackinfoJson = dicTrackLineJason[id];
    for (var i = 0; i < points.length; i++) {
        var no;
        var gp = points[i];
        var ptbk = new esri.geometry.Point(gp.geometry.x, gp.geometry.y, map.spatialReference);
        var trackpointInfoTemplate;
        var BayonentName = "";

        var strTableTimes = "";
        strTableTimes += "<table class=\"l-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
        strTableTimes += "<tr><th>序号</th><th>时间</th><th>车道</th><th>方向</th></tr>"


        for (var i = 0; i < trackinfoJson.bayonets.length; i++) //var i=trackinfoJson.bayonets.length-1;i>=0;i--
        {
            var bayonet = trackinfoJson.bayonets[i];
            if (bayonet.id == gp.attributes["code"]) {
                BayonentName = bayonet.name;
                no = bayonet.no;
                strTableTimes += "<tr><td>" + bayonet.no + "</td><td>" + bayonet.time + "</td><td>" + bayonet.lane + "</td><td>" + bayonet.direction + "</td></tr>";
            }
        }
        /*
        for(var i=0;i<arrTimes.length;i++)
        {
            //strTableTimes+="<li><a href=''>"+arrTimes[i]+"</a></li>";
            strTableTimes+="<tr><td>2</td><td>"+arrTimes[i]+"</td></tr>";
                              
        }
        */
        strTableTimes += "</table>"


        trackpointInfoTemplate = new esri.InfoTemplate();
        trackpointInfoTemplate.setTitle("<b>${name}</b>"); //"<b>${name}</b>"
        //trackpointInfoTemplate.setContent("<span>过车记录</span></br><span>"+strTableTimes+"</span></br><img src=\"img/rosette.png\"  alt=\"${name}\" />");
        trackpointInfoTemplate.setContent("<span>" + strTableTimes + "</span>");

        var gpointbk = new esri.Graphic(ptbk, selTrackPointSymbol_1);
        gpointbk.infoTemplate = trackpointInfoTemplate;
        gpointbk.setAttributes({ "id": id, "type": "tkpoint", "name": BayonentName });
        trackPointLayer.add(gpointbk);

        var textSymbol = new esri.symbol.TextSymbol(no);  //strCarNo
        var font = new esri.symbol.Font();
        font.setSize("8pt");
        font.setFamily("微软雅黑");

        //textSymbol.setColor(GetCarNoColor(trackid)); 
        textSymbol.setFont(font);
        //textSymbol.setOffset(60,-4); 
        var graphicText = esri.Graphic(ptbk, textSymbol); // ,null
        graphicText.setAttributes({ "id": id, "name": BayonentName, "type": "pointno" }); //"type":"tkpoint"
        trackPointLayer.add(graphicText);
    }
    trackPointLayer.redraw();
}

//获取屏幕范围内的点
function GetScreenBayonet() {
    var icout = 0;
    var itemsstring = "";
    var graphics = bayonetLayer.graphics;
    for (var i = 0; i < graphics.length; i++) {
        if (map.extent.contains(graphics[i].geometry)) {
            if (itemsstring.length == 0) {
                itemsstring = graphics[i].attributes["code"];
            }
            else {
                itemsstring += "," + graphics[i].attributes["code"];
            }
            icout++;
        }
    }
    if (icout > 0) {
        /*
        var SeletItems="{\"items\":["+itemsstring+"]}";
        return SeletItems
        */
        return itemsstring;
    }
    else {
        return "";
    }
}


//自动获取当前未使用的颜色 如果返回-1则说明无可用颜色
function GetColorIndex(id) {
    //dicLineColors[0]="0";
    //dicLineColors[1]="1";
    for (var i = 0; i < dicColors.length; i++) {
        if (dicLineColors[i] == strNull) {
            dicLineColors[i] = id; //设置dicLineColors字典的键值 表示颜色已经被占用
            return i;
        }
    }
    return -1;
}

//重置dicLineColors字典的键值为strNull 删除线路时需要
function ResetSetColorIndex(id) {
    for (var i = 0; i < dicLineColors.length; i++) {
        if (dicLineColors[i] == id) {
            dicLineColors[i] = strNull; //重置dicLineColors字典的键值为strNull
            return i;
        }
    }
}

//获取线颜色 当前线路设置的线颜色
function GetLineColor(id) {
    for (var i = 0; i < dicLineColors.length; i++) {
        if (dicLineColors[i] == id) {
            return dicColors[i];
        }
    }
}

//获取当前线路设置的车牌颜色
function GetCarNoColor(id) {
    for (var i = 0; i < dicLineColors.length; i++) {
        if (dicLineColors[i] == id) {
            return dicCarNOColors[i];
        }
    }
}

//设置地图显示区域
function SetAera(AreaInfo) {
    try {
        var areaJson = eval('(' + AreaInfo + ')');
        //var initExtent = new esri.geometry.Extent({"xmin":areaJson.xmin,"ymin":areaJson.ymin,"xmax":areaJson.xmax,"ymax":areaJson.ymax, new SpatialReference({wkid:4326})}); 
        var initExtent = new esri.geometry.Extent(areaJson.xmin, areaJson.ymin, areaJson.xmax, areaJson.ymax, new esri.SpatialReference({ wkid: 4326 }));
        map.extent = esri.geometry.geographicToWebMercator(initExtent);
        return "{\"returncode\":0,\"reason\":\"成功\"}";
    }
    catch (err) {
        return "{\"returncode\":1,\"reason\":\"" + err.message + "\"}";
    }
}

//初始化样式
function SetStyles(StylesInfo) {
    var stylesJson = eval('(' + StylesInfo + ')');
    dicsymbol.length = 0;//清空
    var items = stylesJson.items;
    for (var i = 0; i < items.length; i++) {
        try {
            var p = items[i];
            var ico = "img/" + p.ico;
            var width = p.width;
            var height = p.height;
            var skey = p.key;
            var symbol = new esri.symbol.PictureMarkerSymbol(ico, width, height); //esri.symbols.
            dicsymbol[skey] = symbol;
        }
        catch (err) {
            artDialog({ content: err.message, lock: true });
        }
    }
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//选中
function SetPoint(PointInfo) {
    var graphics = bayonetLayer.graphics;
    var pointJson = eval('(' + PointInfo + ')');
    var setgraphics = pointJson.items;
    for (var i = 0; i < graphics.length; i++) {
        for (var j = 0, jtotal = setgraphics.length; j < jtotal; j++) {
            if (graphics[i].attributes["id"] == setgraphics[j].id) {
                if (dicsymbol[setgraphics[j].key]) {
                    graphics[i].setSymbol(selectedSymbol_1); // =dicsymbol[setgraphics[j].key];            
                }
            }
        }
    }
    bayonetLayer.redraw(); //刷新图层
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//取消选择
function UnSetPoint(PointInfo) {
    var graphics = bayonetLayer.graphics;
    var pointJson = eval('(' + PointInfo + ')');
    var setgraphics = pointJson.items;
    for (var i = 0; i < graphics.length; i++) {
        for (var j = 0, jtotal = setgraphics.length; j < jtotal; j++) {
            if (graphics[i].attributes["id"] == setgraphics[j].id) {
                if (dicsymbol[setgraphics[j].key]) {
                    graphics[i].setSymbol(commonSymbol_1);
                }
            }
        }
    }
    bayonetLayer.redraw(); //刷新图层
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//高亮区域
function HightlightZone(id) {
    //selectzonesymbol
    for (var j = 0; j < map.graphics.graphics.length; j++) {
        var gtemp = map.graphics.graphics[j];
        if (gtemp.attributes) {
            if (id == gtemp.attributes["id"]) {
                gtemp.symbol = selectzonesymbol;
            }
            else {
                gtemp.symbol = defaultzonesymbol;
            }
        }
    }
    map.graphics.redraw();
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//删除区域
function DeleteZone(id) {
    var delgraphic = GetZoneGraphic(id);
    if (delgraphic) {
        var icout = 0;
        var itemsstring = "";
        var graphics = bayonetLayer.graphics;
        /*
        var csymbol=defaultsymbol;
        try
        {
            csymbol=dicsymbol[PointInfo.key];
        }catch(err)
        {}
        */
        for (var i = 0; i < graphics.length; i++) {
            if (delgraphic.geometry.contains(graphics[i].geometry)) {
                //判断在其他区域中不存在
                var bfind = false;
                for (var j = 0; j < map.graphics.graphics.length; j++) {
                    var gtemp = map.graphics.graphics[j];
                    if (gtemp.attributes) {
                        if (delgraphic.attributes["id"] != gtemp.attributes["id"] && gtemp.geometry.contains(graphics[i].geometry)) {
                            bfind = true;
                            break;
                        }
                    }
                }
                //未被其他区域选中
                if (!bfind) {
                    if (graphics[i] == graphicSelected) {
                        graphics[i].setSymbol(commonSymbol_3);
                    }
                    else {
                        graphics[i].setSymbol(commonSymbol_1);
                    }

                    icout++;
                    if (itemsstring.length == 0) {
                        itemsstring = "{\"id\":\"" + graphics[i].attributes["id"] + "\"}";
                    }
                    else {
                        itemsstring += ",{\"id\":\"" + graphics[i].attributes["id"] + "\"}";
                    }
                    //currentlayer.redraw();             
                }
            }
        }
        map.graphics.remove(delgraphic);
        bayonetLayer.redraw();
        if (icout > 0) {
            //selzoneindex++;
            var SeletItems = "{\"items\":[" + itemsstring + "]}";
            callcshar("PointUnSelected", SeletItems);//调用外部
            //callcshar("ZoneUnSelected",id);//调用外部
        }
    }
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

function bayonetSelected(gbayonet) {
    for (var i = 0; i < selectedGraphics.length; i++) {
        if (gbayonet == selectedGraphics[i]) {
            return true;
        }
    }
    return false;
}

//清除所有选择集
function ClearSelectedPoint() {
    historyPointLayer.clear();
    map.graphics.clear();
    for (var i = 0, total = selectedGraphics.length; i < total; i++) {
        selectedGraphics[i].setSymbol(commonSymbol_1);
    }
    selectedGraphics = [];
    toolbar.activate(null);
    bayonetLayer.redraw();
    closeSelLayer.clear();
    map.showZoomSlider();
    callcshar("ClearSelected", "");
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}
function GetZoneGraphic(id) {
    for (var j = 0; j < map.graphics.graphics.length; j++) {
        var gtemp = map.graphics.graphics[j];
        if (gtemp.attributes) {
            if (id == gtemp.attributes["id"]) {
                return gtemp;
            }
        }
    }
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//调用外部c#接口
function callcshar(methodname, param) {
    try {
        //alert(methodname+":"+param);
        window.external.RaiseEvent(methodname, param);
    }
    catch (err)
    { }
}

//创建graphic菜单
function createGraphicsMenu() {
    // Creates right-click context menu for GRAPHICS
    //创建右键菜单并添加删除选区选项

    ctxMenuForGraphics = new dijit.Menu({});
    ctxMenuForGraphics.addChild(new dijit.MenuItem({
        label: "删除选区",
        onClick: function () {
            var sid = selected.attributes["id"];
            DeleteZone(sid);
        }
    }));

    ctxMenuForGraphics.startup();

    //鼠标移动到图元上绑定菜单
    map.graphics.on("mouse-over", function (evt) {
        selected = evt.graphic;
        ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
    });

    //鼠标移出图元解除菜单
    map.graphics.on("mouse-out", function (evt) {
        ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
    });


}

//创建地图菜单
function createMapMenu() {
    ctxMenuForMap = new dijit.Menu({
        onOpen: function (box) {
        }
    });

    //设置地图中点
    ctxMenuForMap.addChild(new dijit.MenuItem({
        label: "设为中点",
        onClick: function (evt) {
            var p = new esri.geometry.ScreenPoint(evt.clientX, evt.clientY);
            var pt = map.toMap(p);
            //var pt = mapEvent.mapPoint;
            map.centerAt(pt);
        }
    }));

    //清除
    ctxMenuForMap.addChild(new dijit.MenuItem({
        label: "清除所有",
        onClick: function (evt) {
            toolbar.deactivate();
            distancetool.deactivate();
            ClearSelectedPoint(); //清除所有选择
        }
    }));

    ctxMenuForMap.startup();
    ctxMenuForMap.bindDomNode(map.container);

}

//跳转到前一视图
function PrevExtentView() {
    if (navToolbar) {
        navToolbar.zoomToPrevExtent();
    }
}

//跳转到下一视图
function NextExtentView() {
    if (navToolbar) {
        navToolbar.zoomToNextExtent();
    }
}

function buildLayerList(layer) {
    //构建图层树形结构
    var layerinfos = layer.layerInfos;
    var treeList = [];//jquery-easyui的tree用到的tree_data.json数组
    var parentnodes = [];//保存所有的父亲节点
    var root = { "id": "rootnode", "text": "所有图层", "children": [] };//增加一个根节点
    var node = {};
    if (layerinfos != null && layerinfos.length > 0) {

        for (var i = 0, j = layerinfos.length; i < j; i++) {
            var info = layerinfos[i];
            //alert(info.name);
            //Console.log(info.name+"/r/n");
            //console.log(info.name+info.defaultVisibility);
            /*
            var info = layerinfos[i] ;
            if (info.defaultVisibility) {
                //visible.push(info.id);
            }
　　　　　　　　　//node为tree用到的json数据
            node = {
                "id":info.id,
                "text":info.name,
                "pid":info.parentLayerId,
                "checked":info.defaultVisibility ? true:false,
                "children":[]
            } ;
            if(info.parentLayerId==-1){
                parentnodes.push(node) ;
                root.children.push(node) ;
            }else{
                    getChildrenNodes(parentnodes, node);
                    parentnodes.push(node) ;
            }
            */
        }
    }

    /*
    treeList.push(root) ;
    //jquery-easyui的树        
    $('#toc').tree({   
        data:treeList ,
        checkbox :true, //使节点增加选择框
        onCheck:function (node,checked){//更新显示选择的图层
            var visible = [];

            var nodes = $('#toc').tree("getChecked") ;
            dojo.forEach(nodes, function(node) {
                visible.push(node.id);
            });
            //if there aren't any layers visible set the array to be -1
            if (visible.length === 0) {
                visible.push(-1);
            }
            layer.setVisibleLayers(visible);
        }
    }); 
    */

    //layer.setVisibleLayers(visible);
    map.addLayer(layer);
}

function getChildrenNodes(parentnodes, node) {
    for (var i = parentnodes.length - 1; i >= 0; i--) {

        var pnode = parentnodes[i];
        //如果是父子关系，为父节点增加子节点，退出for循环
        if (pnode.id == node.pid) {
            pnode.state = "closed";//关闭二级树
            pnode.children.push(node);
            return;
        } else {
            //如果不是父子关系，删除父节点栈里当前的节点，
            //继续此次循环，直到确定父子关系或不存在退出for循环
            parentnodes.pop();
        }
    }
}

//设置地图中点
function setCenter(x, y) {
    var location = new esri.geometry.Point(x, y, map.spatialReference)
    map.centerAndZoom(location, 9);
}

//执行地图查询
function searchMap(words) {
    //实例化FindTask
    findTask = new esri.tasks.FindTask(mapServiceUrl);
    //FindTask的参数
    findParams = new esri.tasks.FindParameters();
    //返回Geometry
    findParams.returnGeometry = true;
    //查询的图层id
    findParams.layerIds = [0, 1, 2];
    //查询字段
    findParams.searchFields = ["BJECTID", "AREANAME", "CAPITAL", "ST", "AREA"];

    findParams.searchText = words;
    findTask.execute(findParams, showResults);
}

//显示findTask的结果
function showResults(results) {
    //清楚上一次的高亮显示
    map.graphics.clear();
    var dataForGrid = [];
    for (var i = 0; i < results.length; i++) {
        var curFeature = results[i];
        var graphic = curFeature.feature;
        //把查询到的对象的字段信息等插入到dataForGrid中
        dataForGrid.push(graphic.attributes);
        //根据类型设置显示样式
        switch (graphic.geometry.type) {
            case "point":
                var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
                break;
            case "polyline":
                var symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 1);
                break;
            case "polygon":
                var symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NONE, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
                break;
        }
        //设置显示样式
        graphic.setSymbol(symbol);
        //添加到graphics进行高亮显示
        map.graphics.add(graphic);
    }

    //dojox.grid.DataGrid显示的一些设置，具体参考dojo的DataGrid
    var data = { identifier: "OBJECTID", label: "OBJECTID", items: dataForGrid };
    var store = new dojo.data.ItemFileReadStore({ data: data });
    //gridWidget为dojox.grid.DataGrid
    gridWidget.setStore(store);
    //过滤条件
    gridWidget.setQuery({ OBJECTID: '*' });

}

function addBayonetClusters() {

    //domStyle.set(query("a.action.zoomTo")[0], "display", "none");
    //var bayonetInfo = {};
    //var wgs = new esri.SpatialReference({
    //    "wkid": 4326
    //});
    var data = new Array();
    var arrPoint = eval('(' + bayonets + ')').items;
    for (var i = 0; i < arrPoint.length; i++) {
        var p = arrPoint[i];
        var latlng = new esri.geometry.Point(parseFloat(p.X), parseFloat(p.Y), map.spatialReference);
        var webMercator;
        require(["esri/geometry/webMercatorUtils"], function (webMercatorUtils) {
            webMercator = webMercatorUtils.geographicToWebMercator(latlng);
        });
        var attributes = {
            "name": p.name,
            "id": p.id,
            "code": p.code,
            "ipaddress": p.ipaddress,
            "state": p.state,
            "desc": p.desc
        };

        //strTableTimes += "<tr><td>编号</td><td>${id}</td></tr>";
        //strTableTimes += "<tr><td>代号</td><td>${code}</td></tr>";
        //strTableTimes += "<tr><td>名称</td><td>${name}</td></tr>";
        //strTableTimes += "<tr><td>IP</td><td>${ipaddress}</td></tr>";
        //strTableTimes += "<tr><td>状态</td><td>${state}</td></tr>";
        //strTableTimes += "<tr><td>描述</td><td>${desc}</td></tr>";

        data[i] = {
            "x": webMercator.x,
            "y": webMercator.y,
            "attributes": attributes
        };
        //console.log("x" + webMercator.x + "y" + webMercator.y);
    }

    //// popupTemplate to work with attributes specific to this dataset
    //var popupTemplate = new esri.dijit.PopupTemplate({
    //    "title": "",
    //    "fieldInfos": [{
    //        "fieldName": "Caption",
    //        visible: true
    //    }, {
    //        "fieldName": "Name",
    //        "label": "By",
    //        visible: true
    //    }, {
    //        "fieldName": "Link",
    //        "label": "On Instagram",
    //        visible: true
    //    }],
    //    "mediaInfos": [{
    //        "title": "",
    //        "caption": "",
    //        "type": "image",
    //        "value": {
    //            "sourceURL": "{Image}",
    //            "linkURL": "{Link}"
    //        }
    //    }]
    //});

    var bayonetInfoTemplate = new esri.dijit.PopupTemplate(); //esri.InfoTemplate
    bayonetInfoTemplate.setTitle("<b>${name}</b>"); //"<b>${name}</b>"

    var strTableTimes = "";
    strTableTimes += "<table class=\"l-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    strTableTimes += "<tr><th>属性</th><th>值</th></tr>"
    strTableTimes += "<tr><td>编号</td><td>${id}</td></tr>";
    strTableTimes += "<tr><td>代号</td><td>${code}</td></tr>";
    strTableTimes += "<tr><td>名称</td><td>${name}</td></tr>";
    strTableTimes += "<tr><td>IP</td><td>${ipaddress}</td></tr>";
    strTableTimes += "<tr><td>状态</td><td>${state}</td></tr>";
    strTableTimes += "<tr><td>描述</td><td>${desc}</td></tr>";
    strTableTimes += "</table>"

    bayonetInfoTemplate.setContent("<span>" + strTableTimes + "</span>");

    // cluster layer that uses OpenLayers style clustering //"distance": 100,   //100
    require(["extras/ClusterLayer"], function (ClusterLayer) {
        bayonetLayer = new ClusterLayer({
            "data": data,
            "distance": 10000000,
            "id": "clustersB",
            "labelColor": "#fff",
            "labelOffset": 10,
            "resolution": map.extent.getWidth() / map.width,
            "singleColor": "#888",
            "singleTemplate": bayonetInfoTemplate //popupTemplate
        });
    });
    
    var defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(10);
    var renderer = new esri.renderer.ClassBreaksRenderer(defaultSym, "clusterCount");

    //var blue = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "BluePin1LargeB.png", 32, 32).setOffset(0, 15);
    //var green = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "GreenPin1LargeB.png", 64, 64).setOffset(0, 15);
    //var red = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "RedPin1LargeB.png", 72, 72).setOffset(0, 15);

    var blue  = new esri.symbol.SimpleMarkerSymbol(
              esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
              12, new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new esri.Color([25, 25, 125, 0.5]),
                6
              ),
              new esri.Color([3, 36, 96, 0.9])).setOffset(0, 15);

    var green = new esri.symbol.SimpleMarkerSymbol(
              esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
              16, new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new esri.Color([32, 235, 2, 0.5]),
                8
              ),
              new esri.Color([43, 201, 80, 0.9])).setOffset(0, 15);

    var red = new esri.symbol.SimpleMarkerSymbol(
              esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
              20, new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new esri.Color([255, 3, 43, 0.5]),
                10
              ),
              new esri.Color([255, 43, 2, 0.9])).setOffset(0, 15);

    renderer.addBreak(0, 1.1, blue);
    renderer.addBreak(1.1, 99.9, green);
    renderer.addBreak(99.9, 1000000, red);


    bayonetLayer.setRenderer(renderer);
    map.addLayer(bayonetLayer);
    //bayonetLayer.redraw();
    //map.setScale(7);
    // close the info window when the map is clicked
    map.on("click", cleanUp);
    // close the info window when esc is pressed
    map.on("key-down", function (e) {
        if (e.keyCode === 27) {
            cleanUp();
        }
    });
}
function addVideoClusters() {

    //domStyle.set(query("a.action.zoomTo")[0], "display", "none");
    //var photoInfo = {};
    //var wgs = new esri.SpatialReference({
    //    "wkid": 4326
    //});
    var data = new Array();
    var arrPoint = eval('(' + videos + ')').items;
    for (var i = 0; i < arrPoint.length; i++) {
        var p = arrPoint[i];
        var latlng = new esri.geometry.Point(parseFloat(p.X), parseFloat(p.Y), map.spatialReference);
        var webMercator;
        require(["esri/geometry/webMercatorUtils"], function (webMercatorUtils) {
            webMercator = webMercatorUtils.geographicToWebMercator(latlng);
        });
        var attributes = {
            "name": p.name,
            "id": p.id,
            "code": p.code,
            "ipaddress": p.ipaddress,
            "state": p.state,
            "desc": p.desc
        };

        //strTableTimes += "<tr><td>编号</td><td>${id}</td></tr>";
        //strTableTimes += "<tr><td>代号</td><td>${code}</td></tr>";
        //strTableTimes += "<tr><td>名称</td><td>${name}</td></tr>";
        //strTableTimes += "<tr><td>IP</td><td>${ipaddress}</td></tr>";
        //strTableTimes += "<tr><td>状态</td><td>${state}</td></tr>";
        //strTableTimes += "<tr><td>描述</td><td>${desc}</td></tr>";

        data[i] = {
            "x": webMercator.x,
            "y": webMercator.y,
            "attributes": attributes
        };
        //console.log("x" + webMercator.x + "y" + webMercator.y);
    }

    //// popupTemplate to work with attributes specific to this dataset
    //var popupTemplate = new esri.dijit.PopupTemplate({
    //    "title": "",
    //    "fieldInfos": [{
    //        "fieldName": "Caption",
    //        visible: true
    //    }, {
    //        "fieldName": "Name",
    //        "label": "By",
    //        visible: true
    //    }, {
    //        "fieldName": "Link",
    //        "label": "On Instagram",
    //        visible: true
    //    }],
    //    "mediaInfos": [{
    //        "title": "",
    //        "caption": "",
    //        "type": "image",
    //        "value": {
    //            "sourceURL": "{Image}",
    //            "linkURL": "{Link}"
    //        }
    //    }]
    //});

    var videoInfoTemplate = new esri.dijit.PopupTemplate(); //esri.InfoTemplate
    videoInfoTemplate.setTitle("<b>${name}</b>"); //"<b>${name}</b>"

    var strTableTimes = "";
    strTableTimes += "<table class=\"l-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    strTableTimes += "<tr><th>属性</th><th>值</th></tr>"
    strTableTimes += "<tr><td>编号</td><td>${id}</td></tr>";
    strTableTimes += "<tr><td>代号</td><td>${code}</td></tr>";
    strTableTimes += "<tr><td>名称</td><td>${name}</td></tr>";
    strTableTimes += "<tr><td>IP</td><td>${ipaddress}</td></tr>";
    strTableTimes += "<tr><td>状态</td><td>${state}</td></tr>";
    strTableTimes += "<tr><td>描述</td><td>${desc}</td></tr>";
    strTableTimes += "</table>"

    videoInfoTemplate.setContent("<span>" + strTableTimes + "</span>");

    // cluster layer that uses OpenLayers style clustering //"distance": 100,   //100
    require(["extras/ClusterLayer"], function (ClusterLayer) {
        videoLayer = new ClusterLayer({
            "data": data,
            "distance": 10000000,
            "id": "clustersV",
            "labelColor": "#fff",
            "labelOffset": 10,
            "resolution": map.extent.getWidth() / map.width,
            "singleColor": "#888",
            "singleTemplate": videoInfoTemplate //popupTemplate
        });
    });

    var defaultSym = new esri.symbol.SimpleMarkerSymbol().setSize(10);
    var renderer = new esri.renderer.ClassBreaksRenderer(defaultSym, "clusterCount");

    //var blue = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "BluePin1LargeB.png", 32, 32).setOffset(0, 15);
    //var green = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "GreenPin1LargeB.png", 64, 64).setOffset(0, 15);
    //var red = new esri.symbol.PictureMarkerSymbol(picBaseUrl + "RedPin1LargeB.png", 72, 72).setOffset(0, 15);

    var blue = new esri.symbol.SimpleMarkerSymbol(
              esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
              12, new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new esri.Color([25, 80, 200, 0.5]),
                6
              ),
              new esri.Color([3, 36, 150, 0.9])).setOffset(0, 15);

    var green = new esri.symbol.SimpleMarkerSymbol(
              esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
              16, new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new esri.Color([32, 128, 2, 0.5]),
                8
              ),
              new esri.Color([43, 128, 80, 0.9])).setOffset(0, 15);

    var red = new esri.symbol.SimpleMarkerSymbol(
              esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
              20, new esri.symbol.SimpleLineSymbol(
                esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                new esri.Color([130, 60, 43, 0.5]),
                10
              ),
              new esri.Color([120, 43, 2, 0.9])).setOffset(0, 15);

    renderer.addBreak(0, 1.1, blue);
    renderer.addBreak(1.1, 99.9, green);
    renderer.addBreak(99.9, 1000000, red);


    videoLayer.setRenderer(renderer);
    map.addLayer(videoLayer);

    //map.on("click", cleanUp);
    //// close the info window when esc is pressed
    //map.on("key-down", function (e) {
    //    if (e.keyCode === 27) {
    //        cleanUp();
    //    }
    //});
}


function cleanUp() {
    map.infoWindow.hide();
    if (bayonetLayer)
    {
        bayonetLayer.clearSingles();
    }
    if (videoLayer)
    {
        videoLayer.clearSingles();
    }
    
}

function error(err) {
    console.log("聚合图层发生错误: ", err);
}

// show cluster extents...
// never called directly but useful from the console
window.showExtents = function () {
    var extentsB = map.getLayer("clusterExtentsB");
    var extentsV = map.getLayer("clusterExtentsV");
    if (extentsB) {
        map.removeLayer(extentsB);
    }
    if (extentsV) {
        map.removeLayer(extentsV);
    }
    extentsB = new GraphicsLayer({ id: "clusterExtentsB" });
    extentsV = new GraphicsLayer({ id: "clusterExtentsV" });
    var sym = new SimpleFillSymbol().setColor(new Color([205, 193, 197, 0.5]));

    if (bayonetLayer)
    {
        arrayUtils.forEach(bayonetLayer._clusters, function (c, idx) {
            var e = c.attributes.extent;
            extentsB.add(new Graphic(new Extent(e[0], e[1], e[2], e[3], map.spatialReference), sym));
        }, this);
    }

    if (videoLayer)
    {
        arrayUtils.forEach(videoLayer._clusters, function (c, idx) {
            var e = c.attributes.extent;
            extentsV.add(new Graphic(new Extent(e[0], e[1], e[2], e[3], map.spatialReference), sym));
        }, this);
    }
    
    map.addLayer(extentsB, 0);
    map.addLayer(extentsV, 0);
};

function ShowDistanceConfig() {
    var url = "View/Map/SetDistance.aspx?Value=" + bufferDistance;
    art.dialog.open(url, {
        lock: true,
        title: "缓冲设置",
        width: '420px',
        height: '40px',
        ok: true,
        ok: function () {
            bufferDistance = this.iframe.contentWindow.$("#txtDistance").val();
        },
        cancel: true
    });
}
var selectWindo = null;
function ShowSelectWindo(t) {
    var url = "View/Map/SelectWindow.aspx";// + bufferDistance;
    selectWindo=art.dialog.open(url, {
        id:"byselectwindow",
        lock: false,
        fixed:false,
        left: '100%',
        top: '120px',
        title: t,
        width: '193px',
        height: '60px',
        //ok: true,
        //ok: function () {
        //    //alert(this.iframe.contentWindow.$("#txtDistance").val());
        //    bufferDistance = this.iframe.contentWindow.$("#txtDistance").val();
        //},
        //cancel: true
    });
}

var videoLayervisable = true;
var bayonetLayervisable = true;
function ShowLayerControl() {
    var url = "View/Map/LayerControl.aspx?v=" + videoLayervisable+"&b="+bayonetLayervisable;
    art.dialog.open(url, {
        lock: false,
        title: "图层设置",
        width: '160px',
        height: '60px',
        left: '100%',
        top: '225px',
        ok: true,
        ok: function () {

            bayonetLayervisable = this.iframe.contentWindow.$("#cbBayonet")[0].checked;
            videoLayervisable = this.iframe.contentWindow.$("#cbVideo")[0].checked;
            console.log("V:" + videoLayervisable + "-B:" + bayonetLayervisable);
            bayonetLayer.setVisibility(bayonetLayervisable);
            videoLayer.setVisibility(videoLayervisable);
        },
        cancel: true,
        cancel: function () {
            //alert("cancel");
        }
    });
}

//点选
function PointSelect() {
    ShowDistanceConfig();
    distancetool.deactivate();
    toolbar.activate(esri.toolbars.Draw.POINT);
    map.hideZoomSlider();
}

//线选
function LineSelect() {
    ShowDistanceConfig();
    distancetool.deactivate();
    toolbar.activate(esri.toolbars.Draw.POLYLINE); //FREEHAND_POLYLINE
    map.hideZoomSlider();
}

//矩形选择
function RectSelect() {
    distancetool.deactivate();
    toolbar.activate(esri.toolbars.Draw.RECTANGLE);
    map.hideZoomSlider();
}

//圆形选择
function CircleSelect() {
    distancetool.deactivate();
    toolbar.activate(esri.toolbars.Draw.CIRCLE);
    map.hideZoomSlider();
}

//多边形选择
function PolygnSelect() {
    distancetool.deactivate();
    toolbar.activate(esri.toolbars.Draw.POLYGON);
    map.hideZoomSlider();
}

//自由选择
function HandSelect() {
    distancetool.deactivate();
    toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
    map.hideZoomSlider();
}

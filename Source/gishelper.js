/* global dojo */
var map;
var drawToolbar, selectedGraphics=new Array();
var toolbar, symbol, geomTask; 
var distancetool;
//var currentlayer;
var psymbol;//默认样式
var pselsymbol;//选中样式
var dicsymbol;
var defaultsymbol; //默认点样式
var ctxMenuForGraphics,ctxMenuForMap;
var selected;
var selzoneindex=0
var selectzonesymbol;
var defaultzonesymbol;
var defaultlinesymbol;
var currentLocation;
var clusterLayer;
var popupOptions;
var graphicSelected;

var showTestData=true;

var mapServiceUrl="http://192.168.0.106:6080/arcgis/rest/services/ShaanXi/MapServer"; //sx
var geoServiceURL="http://192.168.0.106:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer";
var routeServiceURL="http://192.168.0.106:6080/arcgis/rest/services/ShaanXi/NAServer/%E8%B7%AF%E5%BE%84";
var routedLine=true; //true 启用路径,启用路径后轨迹根据最短路径绘制 false 禁用路径轨迹 则轨迹直接直连卡口扣绘制
//var routeTask; //路由任务

//代理设置
var myProxyUrl = "http://192.168.0.106:6088/proxy.ashx";
var isAlwaysUseProxy = false;
var isUseProxy = true; //是否启用代理

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
var strNull="null"; //空字符标记

var dicColors; //线颜色颜色字典 key为数字 value为 Color
var dicCarNOColors; //车牌字体颜色字典 key为数字 value为 Color
var dicLineColors=new Array(strNull,strNull,strNull,strNull); //线与颜色字典 key 为线id value为颜色 key
var selTracLineColor; //选中的线颜色
var selCarNoColor; //选中的车牌颜色

var dicLineNode=new Array(); //线对应点字典
var dicTrackLineJason=new Array(); //线对应点字典 //轨迹线与原始Jason内容

//图层
var trackLineLayer;     //轨迹图层
var trackPointLayer;    //轨迹点图层
var bayonetLayer;       //卡口图层
var historyPointLayer;       //历史纪录点图层

//地图工具
var navToolbar;


//测试数据
var TestStylesInfo='{"items":[{"key":"1","ico":"camera.png","width":16,"height":16},{"key":"2","ico":"camera_go.png","width":16,"height":16},{"key":"3","ico":"camera_link.png","width":16,"height":16}]}';
var TestAreaInfo='{"xmin":105.46,"ymin":35.73,"xmax":110,"ymax":40.77}';
var TestPointInfo='{"layer":"测试图层","key":"1","items":[{"id":1,"name":"卡口1","X":87.575829,"Y":43.782212},{"id":2,"name":"卡口2","X":108.162998,"Y":39.71042},{"id":3,"name":"卡口3","X":107.797303,"Y":36.593642},{"id":4,"name":"卡口4","X":106.584297,"Y":36.119086},{"id":5,"name":"卡口5","X":107.035508,"Y":38.714179},{"id":6,"name":"卡口6","X":108.519115,"Y":29.478925},{"id":7,"name":"卡口7","X":107.668071,"Y":36.457312},{"id":8,"name":"卡口8","X":108.726775,"Y":38.969385},{"id":9,"name":"卡口9","X":106.167225,"Y":38.598524},{"id":10,"name":"卡口10","X":108.967128,"Y":37.276112}]}';

var pointinfo2='{"layer":"测试图层","key":"1","items":[{"id":"1","typename":"","code":"610300001080","name":"岐山县西关卡口","ipaddress":"","X":"107.6066","Y":"34.44798","state":"启用","desc":""},{"id":"2","typename":"","code":"610300001079","name":"岐山县麦禾营卡口","ipaddress":"","X":"107.6223","Y":"34.3696","state":"启用","desc":""},{"id":"3","typename":"","code":"610300001062","name":"岐山县青化卡点","ipaddress":"","X":"107.8351","Y":"34.42287","state":"启用","desc":""},{"id":"4","typename":"","code":"610300001063","name":"岐山县益店卡点","ipaddress":"","X":"107.7485","Y":"34.40557","state":"启用","desc":""},{"id":"5","typename":"","code":"610300001095","name":"麟游县南沟河卡口","ipaddress":"","X":"107.477","Y":"34.76068","state":"启用","desc":""},{"id":"6","typename":"","code":"610300001066","name":"麟游县眉麟公路卡点","ipaddress":"","X":"107.7837","Y":"34.67544","state":"启用","desc":""},{"id":"7","typename":"","code":"610300001065","name":"麟游县崔木卡点","ipaddress":"","X":"107.8571","Y":"34.80992","state":"启用","desc":""},{"id":"8","typename":"","code":"610300001064","name":"麟游县天堂卡点","ipaddress":"","X":"107.5508","Y":"34.91772","state":"启用","desc":""},{"id":"9","typename":"","code":"610300001094","name":"麟游县消水沟卡口","ipaddress":"","X":"107.6624","Y":"34.632","state":"启用","desc":""},{"id":"10","typename":"","code":"610300001096","name":"麟游县城东卡口","ipaddress":"","X":"107.8042","Y":"34.68039","state":"启用","desc":""},{"id":"11","typename":"","code":"303099200001","name":"凤翔县青化卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"12","typename":"","code":"303099200011","name":"岐山县蔡家坡高速出口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"13","typename":"","code":"302103550025","name":"陇县关山卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"14","typename":"","code":"302103550026","name":"陇县峰山卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"15","typename":"","code":"302103550048","name":"眉县姜眉公路","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"16","typename":"","code":"303099200005","name":"岐山孝陵奶牛厂卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"17","typename":"","code":"303099200007","name":"岐山五丈原卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"18","typename":"","code":"303099200009","name":"岐山104省道岐扶交界卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"19","typename":"","code":"302103550018","name":"眉县眉麟路与西宝高速大桥下卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"20","typename":"","code":"303099200006","name":"岐山枣林神差路口卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"21","typename":"","code":"302103550019","name":"G310国道1246km+600m横渠东卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"22","typename":"","code":"302103550049","name":"眉县河营路与汤齐路丁字卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"23","typename":"","code":"302103550050","name":"凤翔县姚家沟镇东卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"24","typename":"","code":"302103550051","name":"凤翔县姚家沟镇西卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"25","typename":"","code":"302103550021","name":"麟游县河崔路1km+600m(三义村)","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"26","typename":"","code":"302103550022","name":"麟游县崔庙常路20km+400m(庙湾)","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"27","typename":"","code":"302103550023","name":"麟游县花两路3km+500m(王新庄)","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"28","typename":"","code":"302103550027","name":"陇县温水卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"29","typename":"","code":"302103550028","name":"陇县新集川卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"30","typename":"","code":"302103550032","name":"凤县红花铺卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"31","typename":"","code":"302103550033","name":"凤县平木镇卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"32","typename":"","code":"303099200002","name":"岐山县城南卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"33","typename":"","code":"303099200004","name":"岐山枣林张家沟卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"34","typename":"","code":"303099200008","name":"岐山北吴邵(西岐路25km)","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"35","typename":"","code":"303099200010","name":"蔡家坡西高新立交卡点","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"36","typename":"","code":"202400013000","name":"陇县定汉高速公路火烧寨","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"37","typename":"","code":"302103550024","name":"麟游县花两路23km+500m(李家河)","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"38","typename":"","code":"302103550012","name":"千阳县城","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"39","typename":"","code":"302103550013","name":"扶风县段家塬村","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"40","typename":"","code":"302103550003","name":"渭滨区北坡西关卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"41","typename":"","code":"610300001037","name":"渭滨区新宝路丁字卡口","ipaddress":"","X":"107.1245","Y":"34.3742","state":"启用","desc":""},{"id":"42","typename":"","code":"610300001126","name":"渭滨区金渭路曙光路西","ipaddress":"","X":"107.1593","Y":"34.37506","state":"启用","desc":""},{"id":"43","typename":"","code":"610300001128","name":"渭滨区经二路西客站卡口","ipaddress":"","X":"107.1329","Y":"34.37357","state":"启用","desc":""},{"id":"44","typename":"","code":"610300001125","name":"渭滨区宝光路二炮门前","ipaddress":"","X":"107.1604","Y":"34.34846","state":"启用","desc":""},{"id":"45","typename":"","code":"610300001122","name":"渭滨区滨河大道石鼓园西800米后拍","ipaddress":"","X":"107.1845","Y":"34.35048","state":"启用","desc":""},{"id":"46","typename":"","code":"610300001120","name":"渭滨区姜谭路钢管厂（渣土车卡口）","ipaddress":"","X":"107.0752","Y":"34.36369","state":"启用","desc":""},{"id":"47","typename":"","code":"610300001118","name":"渭滨区清姜路宝桥东","ipaddress":"","X":"107.1325","Y":"34.36266","state":"启用","desc":""},{"id":"48","typename":"","code":"610300001127","name":"渭滨区金渭路曙光路北","ipaddress":"","X":"107.1593","Y":"34.37508","state":"启用","desc":""},{"id":"49","typename":"","code":"610300001047","name":"渭滨区新宝路经二路卡口","ipaddress":"","X":"107.1245","Y":"34.37424","state":"启用","desc":""},{"id":"50","typename":"","code":"610300001046","name":"渭滨区广元路经二路卡口","ipaddress":"","X":"107.1303","Y":"34.37393","state":"启用","desc":""},{"id":"51","typename":"","code":"610300001045","name":"渭滨区红旗路经二路卡口","ipaddress":"","X":"107.1355","Y":"34.37338","state":"启用","desc":""},{"id":"52","typename":"","code":"610300001044","name":"渭滨区汉中路经二路卡口","ipaddress":"","X":"107.1405","Y":"34.37279","state":"启用","desc":""},{"id":"53","typename":"","code":"610300001068","name":"渭滨区渭滨晁峪卡点","ipaddress":"","X":"106.9658","Y":"34.38675","state":"启用","desc":""},{"id":"54","typename":"","code":"610300001104","name":"渭滨区峪泉路什字","ipaddress":"","X":"107.137","Y":"34.356","state":"启用","desc":""},{"id":"55","typename":"","code":"610300001105","name":"渭滨区新建路什字","ipaddress":"","X":"107.1304","Y":"34.37152","state":"启用","desc":""},{"id":"56","typename":"","code":"610300001029","name":"渭滨区凤鸣春路口卡口","ipaddress":"","X":"107.134","Y":"34.37362","state":"启用","desc":""},{"id":"57","typename":"","code":"610300001030","name":"渭滨区均利广场卡口","ipaddress":"","X":"107.1518","Y":"34.37145","state":"启用","desc":""},{"id":"58","typename":"","code":"610300001031","name":"渭滨区金陵桥西什字卡口","ipaddress":"","X":"107.156","Y":"34.36924","state":"启用","desc":""},{"id":"59","typename":"","code":"610300001032","name":"渭滨区西凤路什字卡口","ipaddress":"","X":"107.1508","Y":"34.37158","state":"启用","desc":""},{"id":"60","typename":"","code":"610300001033","name":"渭滨区文化路什字卡口","ipaddress":"","X":"107.1455","Y":"34.37226","state":"启用","desc":""},{"id":"61","typename":"","code":"610300001034","name":"渭滨区汉中路什字卡口","ipaddress":"","X":"107.1405","Y":"34.37278","state":"启用","desc":""},{"id":"62","typename":"","code":"610300001115","name":"渭滨区经二路新世纪天桥公交稽查","ipaddress":"","X":"107.1385","Y":"34.37304","state":"启用","desc":""},{"id":"63","typename":"","code":"610300001036","name":"渭滨区广元路丁字卡口","ipaddress":"","X":"107.1303","Y":"34.37394","state":"启用","desc":""},{"id":"64","typename":"","code":"610300001039","name":"渭滨区峪泉路火炬路卡口","ipaddress":"","X":"107.137","Y":"34.35596","state":"启用","desc":""},{"id":"65","typename":"","code":"610300001040","name":"渭滨区新建路红旗路卡口","ipaddress":"","X":"107.1352","Y":"34.37084","state":"启用","desc":""},{"id":"66","typename":"","code":"610300001041","name":"渭滨区金渭路经二路什字卡口","ipaddress":"","X":"107.1558","Y":"34.36916","state":"启用","desc":""},{"id":"67","typename":"","code":"610300001035","name":"渭滨区红旗路什字卡口","ipaddress":"","X":"107.1355","Y":"34.37339","state":"启用","desc":""},{"id":"68","typename":"","code":"610300001043","name":"渭滨区文化路经二路卡口","ipaddress":"","X":"107.1455","Y":"34.37218","state":"启用","desc":""},{"id":"69","typename":"","code":"610300001042","name":"渭滨区西凤路经二路卡口","ipaddress":"","X":"107.1508","Y":"34.37161","state":"启用","desc":""},{"id":"70","typename":"","code":"610300001083","name":"岐山县马江镇卡口","ipaddress":"","X":"107.5969","Y":"34.37715","state":"启用","desc":""},{"id":"71","typename":"","code":"610300001082","name":"岐山县城南卡口","ipaddress":"","X":"107.6186","Y":"34.4365","state":"启用","desc":""},{"id":"72","typename":"","code":"610300001081","name":"岐山县龚刘卡口","ipaddress":"","X":"107.6654","Y":"34.31559","state":"启用","desc":""},{"id":"73","typename":"","code":"302103550005","name":"金台区北坡金台观卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"74","typename":"","code":"302103550006","name":"金台区十八孔桥","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"75","typename":"","code":"302103550007","name":"渭滨区红旗路卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"76","typename":"","code":"610300001131","name":"定汉高速宝鸡段","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"77","typename":"","code":"910303000000","name":"金台区东风路卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"78","typename":"","code":"302103550045","name":"千阳县沙家坳乡政府卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"79","typename":"","code":"302103550043","name":"千阳县晖川村卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"80","typename":"","code":"302103550031","name":"千阳县千文路口卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"81","typename":"","code":"302103550039","name":"千阳县辛家沟村委会卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"82","typename":"","code":"302103550016","name":"太白县医院门口卡点210省道140km+800m","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"83","typename":"","code":"302103550035","name":"千阳县寇家河小学卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"84","typename":"","code":"302103550034","name":"千阳县宝兴加油站卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"85","typename":"","code":"302103550036","name":"千阳县千阳岭卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"86","typename":"","code":"302103550040","name":"千阳县柿沟镇卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"87","typename":"","code":"303099200003","name":"岐山马江镇卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"88","typename":"","code":"910303000003","name":"陈仓区千渭什字30","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"89","typename":"","code":"910303000004","name":"陈仓区千渭什字33","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"90","typename":"","code":"910303000005","name":"陈仓区千渭什字34","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"91","typename":"","code":"302103550017","name":"眉县常兴卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"92","typename":"","code":"202400013050","name":"定汉高速公路龙门架下行K13+50m","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"93","typename":"","code":"302103550047","name":"高新职业技术学院","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"94","typename":"","code":"610300001132","name":"定汉高速宝鸡段下行109km+100m","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"95","typename":"","code":"202400013400","name":"定汉高速公路火烧寨上行K13+400m","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"96","typename":"","code":"302103550030","name":"千阳县千川九组卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"97","typename":"","code":"202103550001","name":"渭滨区文化路卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"98","typename":"","code":"302103550004","name":"渭滨区中山路卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"99","typename":"","code":"302103550015","name":"渭滨区胜利桥南卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"100","typename":"","code":"302103550008","name":"金台大道卡点","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"101","typename":"","code":"302103550014","name":"渭滨分局世纪桥北路西卡口","ipaddress":"","X":"0","Y":"0","state":"启用","desc":""},{"id":"102","typename":"","code":"610300001102","name":"陈仓区高新千河卡口","ipaddress":"","X":"107.2983","Y":"34.33951","state":"启用","desc":""},{"id":"103","typename":"","code":"610300001076","name":"陈仓区周原亚子村卡口","ipaddress":"","X":"107.3566","Y":"34.39681","state":"启用","desc":""},{"id":"104","typename":"","code":"610300001075","name":"陈仓区慕仪卡口","ipaddress":"","X":"107.3954","Y":"34.39643","state":"启用","desc":""},{"id":"105","typename":"","code":"610300001074","name":"陈仓区坪头卡口","ipaddress":"","X":"106.8906","Y":"34.39895","state":"启用","desc":""},{"id":"106","typename":"","code":"610300001073","name":"陈仓区新街卡口","ipaddress":"","X":"106.9608","Y":"34.64781","state":"启用","desc":""},{"id":"107","typename":"","code":"610300001072","name":"陈仓区拓石镇卡点","ipaddress":"","X":"106.5289","Y":"34.4953","state":"启用","desc":""},{"id":"108","typename":"","code":"610300001101","name":"陈仓区高新14路路北","ipaddress":"","X":"107.2958","Y":"34.3489","state":"启用","desc":""},{"id":"109","typename":"","code":"610300001008","name":"陈仓区310国道周川村卡口","ipaddress":"","X":"106.8732","Y":"34.39391","state":"启用","desc":""},{"id":"110","typename":"","code":"610300001009","name":"陈仓区底店育才路口","ipaddress":"","X":"107.2948","Y":"34.36732","state":"启用","desc":""},{"id":"111","typename":"","code":"610300001100","name":"陈仓区高新14路路南","ipaddress":"","X":"107.2961","Y":"34.33887","state":"启用","desc":""},{"id":"112","typename":"","code":"610300001010","name":"陈仓区滨河南路与凤凰大桥立交桥下卡口","ipaddress":"","X":"107.3183","Y":"34.34409","state":"启用","desc":""},{"id":"113","typename":"","code":"610300001067","name":"陈仓区高新钓渭卡点","ipaddress":"","X":"107.5151","Y":"34.29251","state":"启用","desc":""},{"id":"114","typename":"","code":"610300001071","name":"凤县留凤关卡点","ipaddress":"","X":"106.6229","Y":"33.81628","state":"启用","desc":""},{"id":"115","typename":"","code":"610300001007","name":"凤县两当交界卡口","ipaddress":"","X":"106.4226","Y":"33.92145","state":"启用","desc":""},{"id":"116","typename":"","code":"610300001099","name":"凤县城北卡口","ipaddress":"","X":"106.5276","Y":"33.91653","state":"启用","desc":""},{"id":"117","typename":"","code":"610300001098","name":"凤县河口卡口","ipaddress":"","X":"106.8114","Y":"33.96","state":"启用","desc":""},{"id":"118","typename":"","code":"610300001097","name":"凤县黄牛铺卡口","ipaddress":"","X":"106.8397","Y":"34.19494","state":"启用","desc":""},{"id":"119","typename":"","code":"610300001060","name":"凤翔县大源卡点","ipaddress":"","X":"107.4924","Y":"34.52946","state":"启用","desc":""},{"id":"120","typename":"","code":"610300001061","name":"凤翔县糜杆桥卡点","ipaddress":"","X":"107.4521","Y":"34.53993","state":"启用","desc":""},{"id":"121","typename":"","code":"610300001059","name":"凤翔县马道口卡点","ipaddress":"","X":"107.2434","Y":"34.45705","state":"启用","desc":""},{"id":"122","typename":"","code":"610300001087","name":"凤翔县石家营柳林镇卡口","ipaddress":"","X":"107.3662","Y":"34.52847","state":"启用","desc":""},{"id":"123","typename":"","code":"610300001086","name":"凤翔县横阳路侯丰卡口","ipaddress":"","X":"107.5145","Y":"34.4171","state":"启用","desc":""},{"id":"124","typename":"","code":"610300001085","name":"凤翔县豆腐村卡口","ipaddress":"","X":"107.3875","Y":"34.51629","state":"启用","desc":""},{"id":"125","typename":"","code":"610300001084","name":"凤翔县东指挥卡口","ipaddress":"","X":"107.3641","Y":"34.48546","state":"启用","desc":""},{"id":"126","typename":"","code":"610300001078","name":"扶风县午井卡口","ipaddress":"","X":"107.833","Y":"34.31523","state":"启用","desc":""},{"id":"127","typename":"","code":"610300001077","name":"扶风县段家卡口","ipaddress":"","X":"107.917","Y":"34.30934","state":"启用","desc":""},{"id":"128","typename":"","code":"610300001069","name":"扶风县天度卡点","ipaddress":"","X":"107.975","Y":"34.48049","state":"启用","desc":""},{"id":"129","typename":"","code":"610300001124","name":"金台区金台大道斗中路东口","ipaddress":"","X":"107.1954","Y":"34.36055","state":"启用","desc":""},{"id":"130","typename":"","code":"610300001103","name":"金台区行政中心什字","ipaddress":"","X":"107.2287","Y":"34.36376","state":"启用","desc":""},{"id":"131","typename":"","code":"610300001121","name":"金台区行政中心大转盘东","ipaddress":"","X":"107.2299","Y":"34.36685","state":"启用","desc":""},{"id":"132","typename":"","code":"610300001038","name":"金台区大庆路斗中路卡口","ipaddress":"","X":"107.1955","Y":"34.36501","state":"启用","desc":""},{"id":"133","typename":"","code":"610300001049","name":"金台区跃进路什字","ipaddress":"","X":"107.1686","Y":"34.36156","state":"启用","desc":""},{"id":"134","typename":"","code":"610300001117","name":"金台区进新村东风路","ipaddress":"","X":"107.1931","Y":"34.36512","state":"启用","desc":""},{"id":"135","typename":"","code":"610300001109","name":"金台区人防隧道2","ipaddress":"","X":"107.1927","Y":"34.36067","state":"启用","desc":""},{"id":"136","typename":"","code":"610300001048","name":"金台区金台大道跃进路","ipaddress":"","X":"107.1686","Y":"34.36158","state":"启用","desc":""},{"id":"137","typename":"","code":"610300001116","name":"金台区南客站东路","ipaddress":"","X":"107.2272","Y":"34.3382","state":"启用","desc":""},{"id":"138","typename":"","code":"123456789012","name":"金台区行政大道蟠龙路","ipaddress":"","X":"107.2293","Y":"34.367","state":"启用","desc":""},{"id":"139","typename":"","code":"610300001108","name":"金台区人防隧道1","ipaddress":"","X":"107.1927","Y":"34.36064","state":"启用","desc":""},{"id":"140","typename":"","code":"610300001123","name":"金台区金台大道斗中路口北","ipaddress":"","X":"107.1953","Y":"34.36093","state":"启用","desc":""},{"id":"141","typename":"","code":"610300001130","name":"金台区西宝高速斗鸡出口","ipaddress":"","X":"107.2011","Y":"34.36037","state":"启用","desc":""},{"id":"142","typename":"","code":"610300001119","name":"金台区新福北路","ipaddress":"","X":"107.1077","Y":"34.38202","state":"启用","desc":""},{"id":"143","typename":"","code":"610300001005","name":"陈仓区连霍高速陈仓收费站卡口","ipaddress":"","X":"106.8698","Y":"34.39258","state":"启用","desc":""},{"id":"144","typename":"","code":"610300001004","name":"渭滨区连霍高速王家梁隧道卡口","ipaddress":"","X":"107.0357","Y":"34.36847","state":"启用","desc":""},{"id":"145","typename":"","code":"610300001003","name":"渭滨区连霍高速姚家山卡口","ipaddress":"","X":"107.0067","Y":"34.37171","state":"启用","desc":""},{"id":"146","typename":"","code":"610300001002","name":"渭滨区连霍高速罗家山隧道下行卡口","ipaddress":"","X":"106.916","Y":"34.39996","state":"启用","desc":""},{"id":"147","typename":"","code":"610300001001","name":"渭滨区连霍高速福谭大桥卡口","ipaddress":"","X":"107.0915","Y":"34.373","state":"启用","desc":""},{"id":"148","typename":"","code":"610300001027","name":"渭滨区经二路香格里拉酒店门前卡口","ipaddress":"","X":"107.1373","Y":"34.37312","state":"启用","desc":""},{"id":"149","typename":"","code":"610300001107","name":"扶风县连霍高速法汤立交上行卡口","ipaddress":"","X":"107.948","Y":"34.26435","state":"启用","desc":""},{"id":"150","typename":"","code":"610300001129","name":"渭滨区连霍高速G30 1127+010M清姜坡","ipaddress":"","X":"107.1247","Y":"34.35669","state":"启用","desc":""},{"id":"151","typename":"","code":"610300001006","name":"陈仓区连霍高速治超站西侧卡口","ipaddress":"","X":"106.86","Y":"34.38512","state":"启用","desc":""},{"id":"152","typename":"","code":"610300001110","name":"扶风县连霍高速法汤段下行","ipaddress":"","X":"107.9464","Y":"34.26347","state":"启用","desc":""},{"id":"153","typename":"","code":"610300001013","name":"扶风县G30陕西段1145KM+360M卡口","ipaddress":"","X":"108.0168","Y":"34.26586","state":"启用","desc":""},{"id":"154","typename":"","code":"610300001015","name":"陈仓区G30陕西段1221Km+400M卡口","ipaddress":"","X":"106.7123","Y":"34.36779","state":"启用","desc":""},{"id":"155","typename":"","code":"610300001106","name":"岐山县连霍高速蔡家坡卡口","ipaddress":"","X":"107.6122","Y":"34.3064","state":"启用","desc":""},{"id":"156","typename":"","code":"610300001089","name":"陇县天成镇卡口","ipaddress":"","X":"106.7279","Y":"34.86985","state":"启用","desc":""},{"id":"157","typename":"","code":"610300001056","name":"陇县河北卡点","ipaddress":"","X":"106.9473","Y":"34.99442","state":"启用","desc":""},{"id":"158","typename":"","code":"610300001090","name":"陇县八渡镇卡口","ipaddress":"","X":"106.878","Y":"34.75468","state":"启用","desc":""},{"id":"159","typename":"","code":"610300001055","name":"陇县神泉卡点","ipaddress":"","X":"106.7763","Y":"34.89054","state":"启用","desc":""},{"id":"160","typename":"","code":"610300001054","name":"陇县温水岭","ipaddress":"","X":"106.819","Y":"34.94423","state":"启用","desc":""},{"id":"161","typename":"","code":"610300001091","name":"陇县李家河卡口","ipaddress":"","X":"106.8736","Y":"35.04125","state":"启用","desc":""},{"id":"162","typename":"","code":"610300001088","name":"眉县西宝高速常兴卡口","ipaddress":"","X":"107.8357","Y":"34.2676","state":"启用","desc":""},{"id":"163","typename":"","code":"610300001070","name":"眉县槐芽卡点","ipaddress":"","X":"107.8659","Y":"34.21049","state":"启用","desc":""},{"id":"164","typename":"","code":"610300001051","name":"千阳县崔家头","ipaddress":"","X":"107.2311","Y":"34.63494","state":"启用","desc":""},{"id":"165","typename":"","code":"610300001053","name":"千阳县张家塬卡点","ipaddress":"","X":"107.0817","Y":"34.68798","state":"启用","desc":""},{"id":"166","typename":"","code":"610300001093","name":"千阳县南寨卡口","ipaddress":"","X":"107.1667","Y":"34.65294","state":"启用","desc":""},{"id":"167","typename":"","code":"610300001092","name":"千阳县宝平高速出口卡口","ipaddress":"","X":"107.1062","Y":"34.65824","state":"启用","desc":""},{"id":"168","typename":"","code":"610300001052","name":"千阳县草碧沟卡口","ipaddress":"","X":"107.0295","Y":"34.75558","state":"启用","desc":""},{"id":"169","typename":"","code":"610300001057","name":"太白县王家塄卡点","ipaddress":"","X":"107.1076","Y":"33.86246","state":"启用","desc":""},{"id":"170","typename":"","code":"610300001058","name":"太白县鹦鸽卡点","ipaddress":"","X":"107.6539","Y":"34.09997","state":"启用","desc":""},{"id":"171","typename":"","code":"610300001114","name":"渭滨区经二路新开路天桥公交稽查","ipaddress":"","X":"107.1426","Y":"34.37258","state":"启用","desc":""},{"id":"172","typename":"","code":"610300001113","name":"渭滨区经二路金都酒店公交稽查","ipaddress":"","X":"107.1541","Y":"34.37072","state":"启用","desc":""},{"id":"173","typename":"","code":"610300001112","name":"渭滨区经二路机场街公交稽查","ipaddress":"","X":"107.1539","Y":"34.37134","state":"启用","desc":""},{"id":"174","typename":"","code":"610300001111","name":"渭滨区经二路红旗路西口公交稽查","ipaddress":"","X":"107.1355","Y":"34.37337","state":"启用","desc":""},{"id":"175","typename":"","code":"610300001017","name":"渭滨区滨河大道石鼓园西800米前拍","ipaddress":"","X":"107.1457","Y":"34.35571","state":"启用","desc":""},{"id":"176","typename":"","code":"610300001016","name":"渭滨区滨河大道教育西路卡口","ipaddress":"","X":"107.1409","Y":"34.36173","state":"启用","desc":""},{"id":"177","typename":"","code":"610300001024","name":"渭滨区钢管厂门前卡口","ipaddress":"","X":"107.1003","Y":"34.36015","state":"启用","desc":""},{"id":"178","typename":"","code":"610300001026","name":"渭滨区经二路群众艺术馆路口卡口","ipaddress":"","X":"107.1282","Y":"34.37418","state":"启用","desc":""},{"id":"179","typename":"","code":"610300001028","name":"渭滨区府西巷卡口","ipaddress":"","X":"107.1273","Y":"34.37395","state":"启用","desc":""}]}';
//var trackInfo2='{"carno":"1 陕A00000","id":"1","bayonets":[{"no":1,"id":"128","name":"卡口1","time":"2012-10-02 21:52:04"},{"no":2,"id":"155","name":"卡口1","time":"2013-10-02 21:52:04"},{"no":3,"id":"133","name":"卡口1","time":"2014-10-02 21:52:04"},{"no":4,"id":"155","name":"卡口1","time":"2015-10-02 21:52:04"}]}'; //测试轨迹
var trackInfo2='{"carno":"陕A55555","id":"5","bayonets":[{"no":"1","id":"610300001080","name":"610300001080","time":"2015-10-15 14:58:27"},{"no":"2","id":"610300001079","name":"610300001079","time":"2015-10-15 14:58:27"},{"no":"3","id":"610300001078","name":"610300001078","time":"2015-10-15 14:58:27"}]}'; //测试轨迹

var trackInfo3='{"carno":"陕CP2801","id":"1","bayonets":[{"no":"1","id":"610300001075","name":"陈仓区慕仪卡口","time":"2015-03-11 11:56:50"},{"no":"2","id":"610300001075","name":"陈仓区慕仪卡口","time":"2015-03-11 11:56:50"},{"no":"3","id":"610300001075","name":"陈仓区慕仪卡口","time":"2015-03-11 11:56:50"},{"no":"4","id":"610300001009","name":"陈仓区底店育才路口","time":"2015-03-14 10:18:34"},{"no":"5","id":"610300001009","name":"陈仓区底店育才路口","time":"2015-03-13 09:13:26"},{"no":"6","id":"610300001009","name":"陈仓区底店育才路口","time":"2015-03-14 08:48:44"},{"no":"7","id":"610300001009","name":"陈仓区底店育才路口","time":"2015-03-12 15:35:12"},{"no":"8","id":"610300001009","name":"陈仓区底店育才路口","time":"2015-03-11 09:07:22"},{"no":"9","id":"610300001085","name":"凤翔县豆腐村卡口","time":"2015-03-11 03:01:52"},{"no":"10","id":"610300001084","name":"凤翔县东指挥卡口","time":"2015-03-11 09:31:17"},{"no":"11","id":"610300001121","name":"金台区行政中心大转盘东","time":"2015-03-12 15:42:00"},{"no":"12","id":"610300001121","name":"金台区行政中心大转盘东","time":"2015-03-10 09:13:11"},{"no":"13","id":"610300001121","name":"金台区行政中心大转盘东","time":"2015-03-13 09:05:30"},{"no":"14","id":"610300001121","name":"金台区行政中心大转盘东","time":"2015-03-11 08:58:16"},{"no":"15","id":"610300001121","name":"金台区行政中心大转盘东","time":"2015-03-12 08:43:53"},{"no":"16","id":"302103550036","name":"千阳县千阳岭卡口","time":"2015-03-10 14:02:18"},{"no":"17","id":"303099200007","name":"岐山五丈原卡口","time":"2015-03-13 12:40:40"},{"no":"18","id":"303099200007","name":"岐山五丈原卡口","time":"2015-03-13 10:41:10"}]}';

var historyPoint='{"bayonetcode":"610300001017","bayonetname":"测试卡口","carno":"陕A55555","lane":"01车道","direction":"向东","picurl":"http://192.168.0.106:6088/kkimages/test.jpg"}';

//var TestTrackInfo='{"carno":"1 陕A00000","id":"1","bayonets":["1","2","3"]}'; //测试轨迹
//var TestTrackInfo2='{"carno":"2 陕A88888","id":"2","bayonets":["2","5","8"]}'; //测试轨迹
//var TestTrackInfo3='{"carno":"3 陕A66666","id":"3","bayonets":["7","8","9"]}'; //测试轨迹
var TestTrackInfo='{"carno":"1 陕A00000","id":"1","bayonets":[{"id":"1"},{"id":"2"},{"id":"3"}]}'; //测试轨迹
var TestTrackInfo2='{"carno":"2 陕A88888","id":"2","bayonets":[{"id":"2"},{"id":"5"},{"id":"8"}]}'; //测试轨迹
var TestTrackInfo3='{"carno":"3 陕A66666","id":"3","bayonets":[{"id":"7"},{"id":"8"},{"id":"9"}]}'; //测试轨迹

var TestSymbolInfo='{"items":[{"key":"1","ico":"camera.png","width":16,"height":16},{"key":"2","ico":"camera_go.png","width":16,"height":16},{"key":"3","ico":"camera_link.png","width":16,"height":16}]}';
var TestChagePointInfo='{"items":[{"id":"1","key":2},{"id":"8","key":2},{"id":"15","key":3}]}';

//从数组中删除指定位置的要素
Array.prototype.remove=function(dx) 
{ 
    if(isNaN(dx)||dx>this.length){return false;} 
    for(var i=0,n=0;i<this.length;i++) 
    { 
        if(this[i]!=this[dx]) 
        { 
            this[n++]=this[i] 
        } 
    } 
    this.length-=1 
}

require([
"esri/map", 
"dojo/_base/lang",
"dojo/json",
"esri/config",
"esri/tasks/GeometryService",
"esri/tasks/AreasAndLengthsParameters",
"dojo/dom-class",
 "esri/dijit/Popup",
 "esri/dijit/PopupTemplate",
"esri/toolbars/draw",
"esri/symbols/SimpleFillSymbol",
"esri/geometry/Point",
"dojo/on","dojo/dom",
"dojo/_base/Color",
"esri/dijit/Scalebar",
"esri/dijit/InfoWindowLite",
"esri/dijit/InfoWindow",
"dojo/dom-construct",
"esri/symbols/SimpleMarkerSymbol",
"esri/symbols/PictureMarkerSymbol",
"esri/symbols/SimpleLineSymbol",
"esri/graphic",
"dojo/dom-style",
"dojo/query",
"esri/layers/GraphicsLayer",
"dojox/widget/ColorPicker",
"esri/layers/CSVLayer",
"esri/Color",
"esri/renderers/SimpleRenderer",
"esri/InfoTemplate",
"esri/urlUtils",
"esri/geometry/scaleUtils",
"esri/dijit/HomeButton",
"esri/tasks/RouteTask",
"esri/toolbars/navigation",
"dojo/domReady!"
], function(
  Map,lang, json, esriConfig, GeometryService, AreasAndLengthsParameters,domClass,Popup,PopupTemplate,
  Draw,SimpleFillSymbol,Point,on,dom,Color,Scalebar,InfoWindowLite,InfoWindow,domConstruct,
  SimpleMarkerSymbol,PictureMarkerSymbol,SimpleLineSymbol,Graphic,domStyle,query,GraphicsLayer,
  arrayUtils, ColorPicker,CSVLayer, SimpleRenderer, InfoTemplate, urlUtils,scaleUtils,HomeButton,RouteTask,navigation
  ) {
  
    //esriConfig.defaults.map.slider = { right:"50px", bottom:"50px", width:"200px", height:null };
    var layer = new esri.layers.ArcGISDynamicMapServiceLayer(mapServiceUrl); //动态地图地址
    //var layer = new esri.layers.ArcGISTiledMapServiceLayer(mapServiceUrl);
  
    //地图缩放级别 一般不需要修改 可以增加删除
    var mylods = [
                {"level" : 0, "resolution" : 0.703125, "scale" : 295497593.05875003},
                {"level" : 1, "resolution" : 0.3515625, "scale" : 147748796.52937502},
                {"level" : 2, "resolution" : 0.17578125, "scale" : 73874398.264687508},
                {"level" : 3, "resolution" : 0.087890625, "scale" : 36937199.132343754},
                {"level" : 4, "resolution" : 0.0439453125, "scale" : 18468599.566171877},
                {"level" : 5, "resolution" : 0.02197265625, "scale" : 9234299.7830859385},
                {"level" : 6, "resolution" : 0.010986328125, "scale" : 4617149.8915429693},
                {"level" : 7, "resolution" : 0.0054931640625, "scale" : 2308574.9457714846},
                {"level" : 8, "resolution" : 0.00274658203125, "scale" : 1154287.472885742},
                {"level" : 9, "resolution" : 0.001373291015625, "scale" : 577143.736442871},
                {"level" : 10, "resolution" : 0.0006866455078125, "scale" : 288571.8682214355},
                {"level" : 11, "resolution" : 0.0003433227539, "scale" : 144285.9341107178},
                {"level" : 12, "resolution" : 0.0001716613769, "scale" : 72142.96705535888},
                {"level" : 13, "resolution" : 0.0000858306884, "scale" : 36071.48352767944},
                {"level" : 14, "resolution" : 0.0000429153442, "scale" : 9017.870881919859},
                {"level" : 15, "resolution" : 0.0000214576721, "scale" : 4508.93544095993},
                {"level" : 16, "resolution" : 0.0000107288360, "scale" : 2254.467720479965},
                {"level" : 17, "resolution" : 0.0000053644180, "scale" : 1127.233860239982},
                {"level" : 18, "resolution" : 0.0000026822090, "scale" : 563.6169301199912},
                {"level" : 19, "resolution" : 0.0000013411045, "scale" : 281.8084650599956}
            ];
    var startExtent;
    require(["esri/SpatialReference","esri/geometry/Extent"],function(SpatialReference,Extent)
                {
                    startExtent = new Extent(106.6543, 34.7099, 107.7474,34.1017, new SpatialReference({wkid:4326}) );
                }
            );
            /*
            urlUtils.addProxyRule({
                urlPrefix: "route.arcgis.com",  
                proxyUrl: "/sproxy/"
                });
                */
                
                if(isUseProxy)
                {
                    esri.config.defaults.io.proxyUrl = myProxyUrl;
                    esri.config.defaults.io.alwaysUseProxy = isAlwaysUseProxy;                    
                }

        //esri.addProxyRule({urlPrefix: "http://route.arcgis.com", proxyUrl:"http:////proxy.ashx”});
        
        http://192.168.0.106:6088/proxy.ashx
    //esriConfig.defaults.map.slider = { right:"10px", top:"200px"}; //, width:"200px", height:null 
    map = new Map("map",{
        //center: [ 109.18354,38.17994 ],
        //nav:true,
        slider:true,
        //sliderOrientation: "vertical", //horizontal,vertical
        sliderPosition: "bottom-right", //bottom-left //top-right
        sliderStyle: "small", //large small
        extent:startExtent,
        logo:false,
        lods:mylods, //动态图需要设置 瓦片图不需要设置 否则不可见
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
    
    distancetool.on("draw-end", lang.hitch(map, getAreaAndLength)); //测距工具绘图完毕
    
    //地图加载完毕初始化地图和选择图元工具
    
    map.on("load", mapLoaded);
    function mapLoaded(){
        createGraphicsMenu(); //初始化选择框右键
        createMapMenu(); //初始化地图右键
    }
    
    if(routedLine)
    {
        //routeTask = new RouteTask(routeServiceURL); //初始化路由服务    
    }
    
    //地图比例尺工具
    var scalebar = new Scalebar({
        map: map,
        scalebarStyle:"line",       //"ruler",
        scalebarUnit: "metric" //"dual","english","metric"
    });
  
    //设置地图默认初始化位置
    var location = new esri.geometry.Point(107.2015,34.3426, map.spatialReference) 
    map.centerAndZoom(location,9);
    
    dicsymbol = new Array(); //图元样式字典
    
    //初始化样式信息
    closeSymbol1=new PictureMarkerSymbol("img/map/carTrackClose1.png", 22, 28);
    closeSymbol2=new PictureMarkerSymbol("img/map/carTrackClose2.png", 22, 28);
    closeSymbol3=new PictureMarkerSymbol("img/map/carTrackClose3.png", 22, 28);
    carNOBKSymbol=new PictureMarkerSymbol("img/map/carbkdef.png", 152, 30);
    carNOBKSymbolSel=new PictureMarkerSymbol("img/map/carbksel.png", 152, 30);
    
    //navToolbar.setZoomSymbol(closeSymbol1);
    
    closeSelSymbol=new PictureMarkerSymbol("img/map/dissel.png", 16, 16);
    //closeSelSymbol=new PictureMarkerSymbol("img/map/dissel2.png", 10, 10);
  
    //默认地图样式 api中不需要关注
    defaultsymbol = new PictureMarkerSymbol("img/camera.png", 16, 16);
    psymbol = new PictureMarkerSymbol("img/camera.png", 16, 16);
    pselsymbol = new PictureMarkerSymbol("img/camera_go.png", 16, 16);
    selectzonesymbol = new esri.symbol.SimpleFillSymbol(  
                esri.symbol.SimpleFillSymbol.STYLE_SOLID,   
                new esri.symbol.SimpleLineSymbol(  
                    esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,   
                    new dojo.Color([0,0,255]),   
                    2  
                ),   
                new dojo.Color([255,0,255,0.25])
                );  
    defaultzonesymbol=new esri.symbol.SimpleFillSymbol(  
                esri.symbol.SimpleFillSymbol.STYLE_SOLID,   
                new esri.symbol.SimpleLineSymbol(  
                    esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,   
                    new dojo.Color([255,0,0]),  
                    2  
                ),  
                new dojo.Color([255,255,0,0.25])  
            ); 
    defaultlinesymbol=new esri.symbol.SimpleLineSymbol(  
            esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,   
            new dojo.Color([0,0,255]),   
            2  
        );
        
        
    //卡口样式默认样式
    commonSymbol_1 = new PictureMarkerSymbol("img/map/点位-小-1.png", 16, 21); //默认
    commonSymbol_2 = new PictureMarkerSymbol("img/map/点位-小-2.png", 16, 21); //鼠标滑过
    commonSymbol_3 = new PictureMarkerSymbol("img/map/点位-小-3.png", 16, 21); //鼠标点击后
    
    //卡口样式选择样式
    selectedSymbol_1 = new PictureMarkerSymbol("img/map/点位-中-1.png", 32, 45); //默认
    selectedSymbol_2 = new PictureMarkerSymbol("img/map/点位-中-2.png", 32, 45); //鼠标滑过
    selectedSymbol_3 = new PictureMarkerSymbol("img/map/点位-中-3.png", 32, 45); //鼠标点击
    
    //轨迹点样式
    selTrackPointSymbol_1= new PictureMarkerSymbol("img/map/路径-点位-中-1.png", 32, 45); //默认
    selTrackPointSymbol_2= new PictureMarkerSymbol("img/map/路径-点位-中-2.png", 32, 45); //默认
    selTrackPointSymbol_3= new PictureMarkerSymbol("img/map/路径-点位-中-3.png", 32, 45); //默认
    
    //初始化颜色字典
    dicColors=new Array(new Color([69,187,255,0.8]),new Color([25,237,170,0.8]),new Color([209,143,255,0.8]),new Color([166,223,11,0.8]));
    dicCarNOColors=new Array(new Color([69,187,255]),new Color([25,237,170]),new Color([209,143,255]),new Color([166,223,11]));
    selTracLineColor=new Color([255,84,0]); //选中的线颜色
    selCarNoColor=new Color([255,255,255]); //选中的车牌颜色
        
    trackLineLayer=new GraphicsLayer("TrackLineLayer");    //轨迹图层
    trackPointLayer=new GraphicsLayer("TrackPointLayer");   //轨迹点图层
    historyPointLayer=new  GraphicsLayer("HistoryPointLayer");
    
    closeSelLayer=new GraphicsLayer("CloseSelLayer"); // 关闭图元选中所在图层
    
    var bayonetInfoTemplate = new esri.InfoTemplate();
    bayonetInfoTemplate.setTitle("<b>${name}</b>"); //"<b>${name}</b>"
    
    var strTableTimes="";
    strTableTimes+="<table class=\"l-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
    strTableTimes+="<tr><th>属性</th><th>值</th></tr>"
    strTableTimes+="<tr><td>编号</td><td>${id}</td></tr>";
    strTableTimes+="<tr><td>代号</td><td>${code}</td></tr>";
    strTableTimes+="<tr><td>名称</td><td>${name}</td></tr>";
    strTableTimes+="<tr><td>IP</td><td>${ipaddress}</td></tr>";
    strTableTimes+="<tr><td>状态</td><td>${state}</td></tr>";
    strTableTimes+="<tr><td>描述</td><td>${desc}</td></tr>";
    strTableTimes+="</table>"
   
    bayonetInfoTemplate.setContent("<span>"+strTableTimes+"</span>");
    
    //bayonetInfoTemplate.setContent("<span>编号:${id}</span></br><span>代号:${code}</span></br><span>名称:${name}</span></br><span>IP:${ipaddress}</span></br><span>状态:${state}</span></br><span>描述:${desc}</span></br><img src=\"img/rosette.png\"  alt=\"${name}\" />");
    bayonetLayer=new GraphicsLayer("BayonetLayer",{infoTemplate: bayonetInfoTemplate});       //卡口图层 
    
    //鼠标移动到图元上触发API
    bayonetLayer.on("mouse-over", function(evt) {
        //var message="名称:"+evt.graphic.attributes["name"];
        //alert(evt.graphic.attributes["name"]);
        //showToolTip(evt,evt.graphic.attributes["name"]);
        
        if(bayonetSelected(evt.graphic))
        {
            //选中状态
            evt.graphic.setSymbol(selectedSymbol_2);
        }
        else
        {
            //未选中状态
            evt.graphic.setSymbol(commonSymbol_2);
        }
        bayonetLayer.redraw();
        callcshar("PointMouseAbove",evt.graphic.attributes["id"]);
    });
    //鼠标离开图元 触发api
    bayonetLayer.on("mouse-out", function(evt) {
        //hideToolTip();
        if(bayonetSelected(evt.graphic))
        {
            //选中状态
            if(evt.graphic==graphicSelected)
            {
                evt.graphic.setSymbol(selectedSymbol_3);
            }
            else
            {
                evt.graphic.setSymbol(selectedSymbol_1);            
            }
        }
        else
        {
            //未选中状态
            if(evt.graphic==graphicSelected)
            {
                evt.graphic.setSymbol(commonSymbol_3);
            }
            else
            {
                evt.graphic.setSymbol(commonSymbol_1);            
            }
        }
        
        bayonetLayer.redraw();
        callcshar("PointMouseLeave",evt.graphic.attributes["id"]);
        //alert("out");
    });
   
    bayonetLayer.on("mouse-down", function(evt) {
        //hideToolTip();
        graphicSelected=evt.graphic;
        //evt.graphic.Symbol=commonSymbol_3;
        
        if(bayonetSelected(evt.graphic))
        {
            //选中状态
            evt.graphic.setSymbol(selectedSymbol_3);
        }
        else
        {
            //未选中状态
            evt.graphic.setSymbol(commonSymbol_3);
        }
        
        for(var i=0;i<bayonetLayer.graphics.length;i++)
        {
            if(bayonetLayer.graphics[i]==evt.graphic)
            {
                
            }
            else
            {
                if(bayonetSelected(bayonetLayer.graphics[i]))
                {
                    bayonetLayer.graphics[i].setSymbol(selectedSymbol_1);
                }
                else
                {
                    bayonetLayer.graphics[i].setSymbol(commonSymbol_1);
                }
            }
        }
        evt.graphic.show();
        bayonetLayer.redraw();
    });
    closeSelLayer.on("mouse-over",function(evt){
        //alert("in");
    });
    closeSelLayer.on("mouse-down", function(evt) {
        //alert(evt.graphic.attributes["id"]);
        //查询图元
        var gBayonet=getBayonet(evt.graphic.attributes["code"]);
        
        //修改状态
        if(gBayonet)
        {
            if(gBayonet==graphicSelected)
            {
                gBayonet.setSymbol(commonSymbol_3);
            }
            else
            {
                gBayonet.setSymbol(commonSymbol_1);            
            }
            //bayonetLayer.redraw();
            //删除当前按钮
            if(selectedGraphics)
            {
                for(var j=selectedGraphics.length-1;j>=0;j--)
                {
                    if(selectedGraphics[j].attributes["code"]==gBayonet.attributes["code"])
                    {
                        selectedGraphics.remove(j);
                    }
                }
            }
            closeSelLayer.remove(evt.graphic);
        }
    });
    
    trackPointLayer.on("mouse-over", function(evt) {
        if(evt.graphic.attributes["canclose"]==1)
        {
            evt.graphic.setSymbol(closeSymbol2.setOffset(145,0));
        }
        else 
        {
            if(evt.graphic.attributes["type"]=="tkpoint")
            {
                evt.graphic.setSymbol(selTrackPointSymbol_2);
            }
            
        }
        //evt.graphic.setSymbol(commonSymbol_1);
        trackPointLayer.redraw();
    });
    
    trackPointLayer.on("mouse-out", function(evt) {
        if(evt.graphic.attributes["canclose"]==1)
        {
            evt.graphic.setSymbol(closeSymbol1.setOffset(145,0));
        }
        else 
        {
            if(evt.graphic.attributes["type"]=="tkpoint")
            {
                evt.graphic.setSymbol(selTrackPointSymbol_1);
            }
        }
        trackPointLayer.redraw();
    });
    
    trackPointLayer.on("mouse-up", function(evt) {
        if(evt.graphic.attributes["canclose"]==1)
        {
            evt.graphic.setSymbol(closeSymbol1.setOffset(145,0));
        }
        else 
        {
            if(evt.graphic.attributes["type"]=="tkpoint")
            {
                evt.graphic.setSymbol(selTrackPointSymbol_1);
            }
            
        }
    });
    
    trackLineLayer.on("mouse-down", function(evt) {
        if(evt.graphic.attributes["type"]=="line")
        {
            SelectTrackLine(evt.graphic.attributes["id"]); //点击的是线路则高亮线路 高亮线路
        }
        
    })
    
    trackPointLayer.on("mouse-down", function(evt) {
        //gpoint.attributes["id"]=1;
        //gpoint.attributes["canclose"]=1;
        if(evt.graphic.attributes["canclose"]==1)
        {
            evt.graphic.setSymbol(closeSymbol3.setOffset(145,0));
            
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
            var trackid=evt.graphic.attributes["id"];
            if(trackid)
            {
                DelTrack(trackid);                
            }
            
            //ar colorIndex=GetColorIndex("ccc");
            //alert(colorIndex);
        }
        else
        {
            
            
            if(evt.graphic.attributes["type"]=="tkpoint")
            {
                evt.graphic.setSymbol(selTrackPointSymbol_3);
                //liyafei 需要调用c#接口进行数据传输哦
                //evt.graphic.attributes["name"]="调用c#传回";
               
                //evt.graphic.attributes["times"]=arrTimes;
                //evt.graphic.setInfoTemplate(template);
                
                //map.infoWindow.show();
                //alert("hello");
            }
            else
            {
                SelectTrackLine(evt.graphic.attributes["id"]); //高亮线路
            }
            
            //evt.graphic.show();
            //trackPointLayer.remove(evt.graphic);
            //trackLineLayer.add(evt.graphic);
            //SelectTrackLine("99");
        }
    })
    
    bayonetLayer.on("mouse-up", function(evt) {
        //hideToolTip();
        //evt.graphic.setSymbol(commonSymbol_1);
        //bayonetLayer.redraw();
    });
    
    trackLineLayer.on("mouse-down", function(evt) {
        evt.graphic.show();
    })

    map.addLayer(trackLineLayer);
    map.addLayer(bayonetLayer);
    map.addLayer(trackPointLayer);
    map.addLayer(closeSelLayer);
    map.addLayer(historyPointLayer);
  
    //dojo.connect(map, "onLoad", createToolbar); // 绑定加载事件  
    
    popupOptions = {
        "markerSymbol": new SimpleMarkerSymbol("circle", 20, null, new Color([0, 0, 0, 0.25])),
        "marginLeft": "20",
        "marginTop": "20"
    };
    
    
    //dojo.connect(map, "onLoad",mapLoaded);
  
    //鼠标移动时在地图左下角显示x(纵坐标),y(横坐标)值
    map.on("mouse-move",mapMouseMove);
    function mapMouseMove(mapEvent)
    {
        try
        {
            var pt = mapEvent.mapPoint;
            dom.byId("currentxy").innerText="X:"+pt.x.toFixed(4)+" Y:"+pt.y.toFixed(4); 
        }
        catch(err)
        {}
    }
  
    //创建地图工具栏
    function createToolbar(themap) {  
        //toolbar = new esri.toolbars.Draw(map);  // esri.toolbars.Draw(map, options)  创建选择工具
        dojo.connect(toolbar, "onDrawEnd", addToMap);   // 绘制完成触发  选择工具
        
        //distancetool = new esri.toolbars.Draw(map);//创建绘图工具
        distancetool.on("draw-end", lang.hitch(map, getAreaAndLength)); //测距工具绘图完毕
    }
    
    //GeometryService 创建地理服务（需要在arcgis开启此项服务）
    var geometryService = new GeometryService(geoServiceURL); 
    geometryService.on("areas-and-lengths-complete", outputAreaAndsLength); //测量面积结束事件
    //geometryService.on("onLengthsComplete", outputDistance);
    dojo.connect(geometryService, "onLengthsComplete", outputDistance);//测量长度结束事件
  
    var dtype=0; // 1 测面积 其他 测距
    function getAreaAndLength(evtObj) {
        var map = this;
        var geometry = evtObj.geometry; //取得当前几何体体
        distancetool.deactivate();
        map.showZoomSlider();
        var graphic;
        if (geometry.type == "polyline") {
            //测距
            dtype=0;
            
            //将几何体添加到地图
            graphic = map.graphics.add(new Graphic(geometry, defaultlinesymbol));
            
            //设置测量参数 测量长度
            var lengthParams = new esri.tasks.LengthsParameters(); 
            lengthParams.polylines = [geometry];
            lengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
            lengthParams.geodesic = true;
            geometryService.lengths(lengthParams);
        
        }
        else
        {
            //测量面积
            dtype=1;
            
            //将几何体添加到地图
            graphic = map.graphics.add(new Graphic(geometry,
                new SimpleFillSymbol()));
                
            //设置测量参数 测量面积
            var areasAndLengthParams = new AreasAndLengthsParameters();
            areasAndLengthParams.lengthUnit = GeometryService.UNIT_METER;
            areasAndLengthParams.areaUnit = GeometryService.UNIT_SQUARE_METERS;
            areasAndLengthParams.calculationType = "geodesic";
            geometryService.simplify([geometry],
                function(simplifiedGeometries) {
                areasAndLengthParams.polygons = simplifiedGeometries;
                geometryService.areasAndLengths(areasAndLengthParams);
                });
        }
    }
  
    //输出面积函数
    function outputAreaAndsLength(evtObj) {
        //取得测量结果
        var result = evtObj.result;
        if(dtype==1)
        {
            //输出面积
            var r;
            if(result.areas[0]>1000000)
            {
                r=(result.areas[0]/1000000).toFixed(2)+"平方千米";           
            }
            else
            {
                r=result.areas[0].toFixed(2)+"平方米";
            }
            alert(r);
        }
        else
        {
            //无用
            alert(result.lengths[0].toFixed(2)+"米");      
        }
        //distancetool.deactivate();
    }
    
    //取得测量长度结果
    function outputDistance(result) {
        var r;
        if(result.lengths[0]>1000)
        {
            r=(result.lengths[0]/1000).toFixed(2)+ "千米";
        }
        else
        {
            r = result.lengths[0].toFixed(2)+ "米";
        }
        alert(r);
        //distancetool.deactivate();
    }
    
    //将选择框几何体添加到地图中
    function addToMap(geometry) {  
        toolbar.deactivate();  // 关闭工具栏并激活地图导航.  
        map.showZoomSlider();  //在地图上显示的缩放滑块  
        // 判断几何图形的类型 
        var graphic = new esri.Graphic(geometry,
            defaultzonesymbol,{"id":selzoneindex}); 
        var sid=selzoneindex;
        //选中
        var icout=0;
        var itemsstring="";
        
        var graphics = bayonetLayer.graphics;  
        for(var i= 0;i<graphics.length;i++){  
            if(graphic.geometry.contains(graphics[i].geometry)){ 
                
                var bFind=false;
                for(var j=0;j<selectedGraphics.length;j++)
                {
                    if(graphics[i].attributes["id"]==selectedGraphics[j].attributes["id"])
                    {
                        bFind=true;
                        break;
                    }                   
                }
                if(!bFind)
                {
                    icout++;
                    selectedGraphics.push(graphics[i]);  
    
                    if( graphics[i]==graphicSelected)
                    {
                        graphics[i].setSymbol(selectedSymbol_3); 
                    }
                    else
                    {
                        graphics[i].setSymbol(selectedSymbol_1);                        
                    }
                        
                    if(itemsstring.length==0)
                    {
                        itemsstring="{\"id\":\""+graphics[i].attributes["id"]+"\"}";              
                    }
                    else
                    {
                        itemsstring+=",{\"id\":\""+graphics[i].attributes["id"]+"\"}";              
                    }
                    
                    //需要在此处添加关闭按钮 liyafei
                    var pt=new esri.geometry.Point(graphics[i].geometry.x,graphics[i].geometry.y,map.spatialReference);  
                    var ggloseselpoint = new esri.Graphic(pt,closeSelSymbol.setOffset(0,-20)); // items[i]//new esri.symbols.PictureMarkerSymbol("img/rosette.png", 16, 16)
                    ggloseselpoint.setAttributes({"id":graphics[i].attributes["id"],"code":graphics[i].attributes["code"]});
                    closeSelLayer.add(ggloseselpoint);
                }
                
                //closeSelLayer.redraw();
                
                //currentlayer.redraw();
                
                /*
                //判断在其他区域中不存在
                var bfind=false;
                for(var j=0;j<map.graphics.graphics.length;j++)
                {
                    var gtemp=map.graphics.graphics[j];
                    if(gtemp.attributes)
                    {
                        if(graphic.attributes["id"]!=gtemp.attributes["id"]
                            &&gtemp.geometry.contains(graphics[i].geometry))
                        {
                        bfind=true;
                        break;
                        }                
                    }   
                }
                //未被其他区域选中
                if(!bfind)
                {
                    icout++;
                    selectedGraphics.push(graphics[i]);  

                    if( graphics[i]==graphicSelected)
                    {
                        graphics[i].setSymbol(selectedSymbol_3); 
                    }
                    else
                    {
                        graphics[i].setSymbol(selectedSymbol_1);                        
                    }
                        
                    if(itemsstring.length==0)
                    {
                        itemsstring="{\"id\":\""+graphics[i].attributes["id"]+"\"}";              
                    }
                    else
                    {
                        itemsstring+=",{\"id\":\""+graphics[i].attributes["id"]+"\"}";              
                    }
                    //currentlayer.redraw();
                    bayonetLayer.redraw();        
                } 
                */ 
            }  
        }
        if(icout>0)
        {
            bayonetLayer.redraw(); 
            //map.graphics.add(graphic);
            selzoneindex++;
            //HightlightZone(1);
            var SeletItems="{\"items\":["+itemsstring+"]}";
            callcshar("PointSelected",SeletItems);//调用外部
            //callcshar("ZoneSelected",sid);//调用外部
            //DeleteZone(9);
        }
    }
    
    //前一视图
    on(dom.byId("PrevExtent"), "click", function(){ 
        navToolbar.zoomToPrevExtent();
    });
    
    //下一视图
    on(dom.byId("NextExtent"), "click", function(){ 
        navToolbar.zoomToNextExtent();
    });

    //矩形选择
    on(dom.byId("extent"), "click", function(){ 
        distancetool.deactivate();
        toolbar.activate(esri.toolbars.Draw.EXTENT);
        map.hideZoomSlider();
    });
    /*
    //多边形
    on(dom.byId("polygon"), "click", function(){ 
        distancetool.deactivate();
        toolbar.activate(esri.toolbars.Draw.POLYGON);
        map.hideZoomSlider();
    }); 
    */
    //手绘多面体
    on(dom.byId("handdraw"), "click", function(){
        distancetool.deactivate();
        toolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
        map.hideZoomSlider();
    }); 
    //圆形
    on(dom.byId("circle"), "click", function(){
        distancetool.deactivate();
        toolbar.activate(esri.toolbars.Draw.CIRCLE);
        map.hideZoomSlider();
    }); 
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
    on(dom.byId("distance"), "click", function(){  
        toolbar.deactivate();
        distancetool.activate(esri.toolbars.Draw.POLYLINE);
        map.hideZoomSlider();
    });
    
    /*
    //测面积
    on(dom.byId("area"), "click", function(){  
        toolbar.deactivate();
        distancetool.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
        map.hideZoomSlider();
    });
    */
    
    //打印
    on(dom.byId("print"), "click", function(){  
        callcshar("MapPrint",null);
    });
    
    //全屏
    on(dom.byId("fullscreen"), "click", function(){  
        callcshar("FullScreen",null);
    });
    
    /*
    //显示鹰眼地图
    ShowOverviewMap();
    */
    
    /*
    //显示 home按钮
    var home = new esri.dijit.HomeButton({
        map: map
        }, "HomeButton");
        home.startup();
    */
    callcshar("MapLoadCompleted",null);
    
    //document.getElementById("map_graphics_layer").style('display: none;');
    
    //调用测试接口
    if(showTestData)
    {
        Tests();        
    }
});

//显示鹰眼地图
//dojo.require("esri/dijit/OverviewMap");
function ShowOverviewMap() { 
    require(["esri/dijit/OverviewMap"],function(OverviewMap)
                {
                    var overviewMapDijit = new OverviewMap({
                        map: map,
                        attachTo: "bottom-right",
                        visible: false,
                        color:" #D84E13",
                        opacity: .40
                        });
                    overviewMapDijit.startup();
                }
            );
    
    
}
/*
dojo.require("dijit.Dialog"); 
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
function Tests()
{
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
dojo.require("esri/layers/GraphicsLayer");
function PointShow(PointInfo)
{
    var pointsJson=eval('(' + PointInfo + ')');
    map.infoWindow.resize(300,200);
    var csymbol=commonSymbol_1;
    var items= pointsJson.items;  
    for(var i=0;i<items.length;i++){  
        var pt=new esri.geometry.Point(items[i].X,items[i].Y,map.spatialReference);  
        var gpoint = new esri.Graphic(pt,csymbol,items[i]); // items[i]//new esri.symbols.PictureMarkerSymbol("img/rosette.png", 16, 16)
        bayonetLayer.add(gpoint);
    }
    bayonetLayer.redraw();
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}


dojo.require("esri/layers/GraphicsLayer");
dojo.require("esri/map");
//现实历史纪录
function ShowHistoryPoint(HistroyPoint)
{
    //var hispoint=eval(HistroyPoint);
    
    var hispoint=eval('(' + HistroyPoint + ')');
    //清除旧的
    map.infoWindow.hide();
    historyPointLayer.clear();

    var gp=getBayonet(hispoint.bayonetcode);
    if(gp)
    {
        var historyTemplate = new esri.InfoTemplate();
        historyTemplate.setTitle("<b>${bayonetcode}</b>"); //"<b>${name}</b>"
        historyTemplate.setContent("<span>卡口代号:${bayonetcode}</span></br><span>卡口名称:${bayonetname}</span></br><span>车牌号:${carno}</span></br><span>车道:${lane}</span></br><span>方向:${direction}</span></br><a href=\""+hispoint.picurl+"\" target=\"_blank\"><img src=\""+hispoint.picurl+"\"  height=\"170\" width=\"260\"></a>");
        var histoyrsymbol;
        require(["esri/symbols/PictureMarkerSymbol"],function(PictureMarkerSymbol)
        {
            histoyrsymbol = new PictureMarkerSymbol(hispoint.picurl, 150, 100);
        });
        
        var pt=new esri.geometry.Point(gp.geometry.x,gp.geometry.y,map.spatialReference);  
        var gpoint = new esri.Graphic(pt,histoyrsymbol,hispoint); // items[i]//new esri.symbols.PictureMarkerSymbol("img/rosette.png", 16, 16)
        gpoint.setAttributes({"bayonetcode":hispoint.bayonetcode,"bayonetname":hispoint.bayonetname,"carno":hispoint.carno,"lane":hispoint.lane,"direction":hispoint.direction,"picurl":hispoint.picurl});
        gpoint.infoTemplate=historyTemplate;
        historyPointLayer.add(gpoint);
        
        map.centerAt(pt);

        /* 调不通不知道为啥
        map.infoWindow.setTitle("我是标题");
        map.infoWindow.setContent("我是内容");
        var screenpoint=map.toScreen(gp.geometry);
        map.infoWindow.show(screenpoint); 
        */
    }
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//显示信息
function ShowInfoWindow(title,content)
{
    map.infoWindow.setTitle(title);
    map.infoWindow.setContent(content);
    var screenpoint=map.extent.getCenter();
    map.infoWindow.show(screenpoint);    
}

//绘制轨迹
dojo.require("esri/symbols/SimpleLineSymbol");
function ShowTrack(TrackInfo)
{
    var trackinfoJson=eval('(' + TrackInfo + ')');
    var trackid=trackinfoJson.id;
    var strCarNo=trackinfoJson.carno;
    var colorIndex=GetColorIndex(trackid);
    //alert(colorIndex);
    if(colorIndex==-1)
    {
        alert("轨迹数量超过最大可显示数量!");
        return "{\"returncode\":1,\"reason\":\"轨迹数量超过最大可显示数量\"}"; 
    }
    else
    {
        var line = new esri.geometry.Polyline(map.spatialReference);  
        
        var points =new Array();
        var gp; //用于保存最后一个点
        
        //slsTrackStyle=slsTrackStyle.setColor(GetLineColor(trackid));
        //初始化样式
        var lineSymbol;
        require(["esri/symbols/SimpleLineSymbol","esri/Color"],function(SimpleLineSymbol,Color)
                    {
                        lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,  
                                new Color([0, 255, 0]),  
                                2  
                        );  
                    }
                );
        
        var style= lineSymbol.setColor(GetLineColor(trackid)).setWidth(2); 
        
        var arrayPoint=new Array();
        for(var i=0;i<trackinfoJson.bayonets.length;i++)
        {
            gp=getBayonet(trackinfoJson.bayonets[i].id);
            if(gp)
            {
                var ptemp=new esri.geometry.Point(gp.geometry.x,gp.geometry.y,map.spatialReference);  
                points.push(ptemp);
                arrayPoint.push(gp);                
            }
        }
        
        //var linenode={};
        //linenode.id=trackid;
        //linenode.points=arrayPoint;
        //dicLineNode.push(linenode);
        
        if(points.length<2)
        {
            ResetSetColorIndex(trackid);
            alert("有效轨迹点数量不足！");
            return "{\"returncode\":1,\"reason\":\"轨迹点数量不足！\"}"; 
        }
        
        dicLineNode[trackid]=arrayPoint;
        dicTrackLineJason[trackid]=trackinfoJson;
        line.addPath(points);
 
        function addline() //直连线路
        {
            var lineGraphic = new esri.Graphic(line, style); 
            lineGraphic.setAttributes({"id":trackid,"type":"line"});
            trackLineLayer.add(lineGraphic);
        }
        
        
        //判断是否启用路径
        if(routedLine)
        {
            //setup the route //参数
            var routeParams; //路由参数
            var stopSymbol;
            var routeTask;
            require(["esri/tasks/RouteTask","esri/tasks/RouteParameters","esri/tasks/FeatureSet","esri/symbols/SimpleMarkerSymbol"]
            ,function(RouteTask,RouteParameters,FeatureSet,SimpleMarkerSymbol)
                    {
                        routeTask = new RouteTask(routeServiceURL); //初始化路由服务   
                        stopSymbol = new SimpleMarkerSymbol().setStyle(SimpleMarkerSymbol.STYLE_CROSS).setSize(1);
                        routeParams = new RouteParameters();
                        routeParams.stops = new FeatureSet();
                    }
                );
            
            routeParams.outSpatialReference = map.spatialReference;
            
            routeTask.on("solve-complete", function(evt) {
                var lineGraphic=evt.result.routeResults[0].route.setSymbol(style);
                var tid=trackid;
                lineGraphic.setAttributes({"id":tid,"type":"line"});//trackid
                trackLineLayer.add(lineGraphic);
            });
            
            routeTask.on("error", function(evt) {
                addline();
            });
            
            //多个点一起提交计算路径
            for(var i=0;i<points.length;i++)
            {
                var stop= new esri.Graphic(points[i], stopSymbol);
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
                var lineGraphic=evt.result.routeResults[0].route.setSymbol(style);
                var tid=routeParams.attributeParameterValues[0].value;
                lineGraphic.setAttributes({"id":tid,"type":"line"});//trackid
                trackLineLayer.add(lineGraphic);
            }
    
            //计算最短路径出错，改用直接连接方式
            function errorHandler(err) {
                //alert("An error occured\n" + err.message + "\n" + err.details.join("\n"));
                //出错直连
                addline();
            }  
        }
        else
        {
            //未启用最短路径方式连接轨迹则直接直连
            addline(); //直连轨迹            
        }

        //type- bk  车牌背景  cl 关闭 lb 标签 tkpoint 轨迹点
        //车牌 背景
        var ptbk=new esri.geometry.Point(gp.geometry.x,gp.geometry.y,map.spatialReference);  
        var gpointbk = new esri.Graphic(ptbk,carNOBKSymbol.setOffset(80,0)); // items[i]//new esri.symbols.PictureMarkerSymbol("img/rosette.png", 16, 16)
        gpointbk.setAttributes({"id":trackid,"type":"bk"});
        trackPointLayer.add(gpointbk);

        //关闭图标 和标注
        var pt=new esri.geometry.Point(gp.geometry.x,gp.geometry.y,map.spatialReference);  
        var gpoint = new esri.Graphic(pt,closeSymbol1.setOffset(145,0)); // items[i]//new esri.symbols.PictureMarkerSymbol("img/rosette.png", 16, 16)
        gpoint.setAttributes({"id":trackid,"canclose":1,"type":"cl"});
        trackPointLayer.add(gpoint);
        
        //车号
        var font = new esri.symbol.Font(); 
        font.setSize("10pt"); 
        font.setFamily("微软雅黑"); 
        
        //文本标注
        var textSymbol = new esri.symbol.TextSymbol(strCarNo);  //strCarNo
        textSymbol.setColor(GetCarNoColor(trackid)); 
        textSymbol.setFont(font); 
        textSymbol.setOffset(60,-4); 
        var graphicText = esri.Graphic(pt,textSymbol); // ,null
        graphicText.setAttributes({"id":trackid,"type":"lb"});
        //graphicText.setSymbol(textSymbol);
        trackPointLayer.add(graphicText);
        
        return "{\"returncode\":0,\"reason\":\"成功\"}";        
    }
    
    
}

//删除轨迹信息
function DelTrack(trackid)
{
    for(var j=trackLineLayer.graphics.length-1;j>=0;j--)
    {
        if(trackLineLayer.graphics[j].attributes["id"]==trackid)
        {
            trackLineLayer.remove(trackLineLayer.graphics[j])
        }        
    }
    
    for(var j=trackPointLayer.graphics.length-1;j>=0;j--)
    {
        if(trackPointLayer.graphics[j].attributes["id"]==trackid)
        {
            trackPointLayer.remove(trackPointLayer.graphics[j])
        }        
    }
    
    ResetSetColorIndex(trackid); //清除颜色占用供其他使用    
}

//清除所有轨迹信息
function DelTrackAll()
{
    trackLineLayer.clear();
    trackPointLayer.clear();
    for(var i=0;i<dicLineColors.length;i++)
    {
        dicLineColors[i]=strNull; //重置dicLineColors字典的键值为strNull
    }
}

function TestTextSymbol()
{
    //车号
    var font = new esri.symbol.Font(); 
    font.setSize("36pt"); 
    font.setFamily("宋体"); 
    
    var pt=new esri.geometry.Point(108.8,37.54,map.spatialReference); 
    var textSymbol = new esri.symbol.TextSymbol("陕A8京93M3",font,GetCarNoColor(1));  //strCarNo
    //textSymbol.font.setDecoration(180);
    //textSymbol.angle=45;
    //textSymbol.setFont(font);
    //textSymbol.setColor(GetCarNoColor(1)); 
    //textSymbol.setFont(font); 
    //textSymbol.setOffset(60,-4); 
    var graphicText = new esri.Graphic(pt,textSymbol); // ,null
    graphicText.setAttributes({"id":"ccccccc","type":"lb","canclose":0});
    //graphicText.setSymbol(textSymbol);
    //trackPointLayer.add(graphicText);
    trackPointLayer.add(graphicText);
    //map.graphics.add
}

//根据卡口ID取得卡口
function getBayonet(code)
{
    for(var i=0;i<bayonetLayer.graphics.length;i++)
    {
        if(bayonetLayer.graphics[i].attributes["code"]==code)
        {
            return  bayonetLayer.graphics[i];     
        }
    }
    return null;
}

function SelectTrackLine(id)
{
    //修改选中的为选中样式 其他为模式样式
    
    //trackLineLayer //线路层样式修改
    for(var i=0;i<trackLineLayer.graphics.length;i++)
    {
        var gp=trackLineLayer.graphics[i];
        var sid=gp.attributes["id"];
        if(gp.attributes["type"]=="line")
        {
            if(gp.attributes["id"]==id)
            {
                //选中样式
                gp.setSymbol(gp.symbol.setColor(selTracLineColor).setWidth(4));
                gp.show();
            }
            else
            {
                //非选中样式 
                gp.setSymbol(gp.symbol.setColor(GetLineColor(sid)).setWidth(2));
            }            
        }
        
        
    }
    
    //trackPointLayer //轨迹标记层样式修改
    for(var i=0;i<trackPointLayer.graphics.length;i++)
    {
        var gp=trackPointLayer.graphics[i];
        var sid=gp.attributes["id"];
        if(sid==id)
        {
            //车牌背景图片
            if(gp.attributes["type"]=="bk") 
            {
                //选中
                gp.setSymbol(carNOBKSymbolSel.setOffset(80,0));
            }
            //车牌号
            if(gp.attributes["type"]=="lb") 
            {
                //选中
                gp.setSymbol(gp.symbol.setColor(selCarNoColor));
            }
        }
        else
        {
            //车牌背景图片
            if(gp.attributes["type"]=="bk") 
            {
                //未选中
                gp.setSymbol(carNOBKSymbol.setOffset(80,0));     
            }       
            
            //车牌号
            if(gp.attributes["type"]=="lb") 
            {
                //未选中
                gp.setSymbol(gp.symbol.setColor(GetCarNoColor(sid)));
            }  
        }
    }
    
    DrawTrackPoint(id);
}

//绘制历史信息点
function DrawTrackPoint(id)
{
    //清除其他未选中的
    for(var i=trackPointLayer.graphics.length-1;i>=0;i--)
    {
        var gp=trackPointLayer.graphics[i];
        if(gp.attributes["type"]=="tkpoint"||gp.attributes["type"]=="pointno") 
        {
            //选中
            trackPointLayer.remove(gp);
        }
    }
    //绘制新的
    var points=dicLineNode[id];
    var trackinfoJson=dicTrackLineJason[id];
    for(var i=0;i<points.length;i++)
    {
        var no;
        var gp=points[i];
        var ptbk=new esri.geometry.Point(gp.geometry.x,gp.geometry.y,map.spatialReference);  
        var trackpointInfoTemplate;
        var BayonentName="";
        require(["esri/InfoTemplate"],function(InfoTemplate)
        {
            var strTableTimes="";
            strTableTimes+="<table class=\"l-table\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">";
            strTableTimes+="<tr><th>序号</th><th>时间</th><th>车道</th><th>方向</th></tr>"
            
            
            for(var i=0;i<trackinfoJson.bayonets.length;i++) //var i=trackinfoJson.bayonets.length-1;i>=0;i--
            {
                var bayonet=trackinfoJson.bayonets[i];
                if(bayonet.id==gp.attributes["code"]) 
                {
                    BayonentName=bayonet.name;
                    no=bayonet.no;
                    strTableTimes+="<tr><td>"+bayonet.no+"</td><td>"+bayonet.time+"</td><td>"+bayonet.lane+"</td><td>"+bayonet.direction+"</td></tr>";
                }
            }
            /*
            for(var i=0;i<arrTimes.length;i++)
            {
                //strTableTimes+="<li><a href=''>"+arrTimes[i]+"</a></li>";
                strTableTimes+="<tr><td>2</td><td>"+arrTimes[i]+"</td></tr>";
                              
            }
            */
            strTableTimes+="</table>"
            
            
            trackpointInfoTemplate = new esri.InfoTemplate();
            trackpointInfoTemplate.setTitle("<b>${name}</b>"); //"<b>${name}</b>"
            //trackpointInfoTemplate.setContent("<span>过车记录</span></br><span>"+strTableTimes+"</span></br><img src=\"img/rosette.png\"  alt=\"${name}\" />");
            trackpointInfoTemplate.setContent("<span>"+strTableTimes+"</span>");
            
        });
        
        var gpointbk = new esri.Graphic(ptbk,selTrackPointSymbol_1);
        gpointbk.infoTemplate=trackpointInfoTemplate;
        gpointbk.setAttributes({"id":id,"type":"tkpoint","name":BayonentName});
        trackPointLayer.add(gpointbk);
        
        var textSymbol = new esri.symbol.TextSymbol(no);  //strCarNo
        var font = new esri.symbol.Font(); 
        font.setSize("8pt"); 
        font.setFamily("微软雅黑"); 
        
        //textSymbol.setColor(GetCarNoColor(trackid)); 
        textSymbol.setFont(font); 
        //textSymbol.setOffset(60,-4); 
        var graphicText = esri.Graphic(ptbk,textSymbol); // ,null
        graphicText.setAttributes({"id":id,"name":BayonentName,"type":"pointno"}); //"type":"tkpoint"
        trackPointLayer.add(graphicText);
    }
    trackPointLayer.redraw();
}

//获取屏幕范围内的点
function GetScreenBayonet()
{
    var icout=0;
    var itemsstring="";
    var graphics = bayonetLayer.graphics;  
    for(var i= 0;i<graphics.length;i++){  
        if(map.extent.contains(graphics[i].geometry)){ 
            if(itemsstring.length==0)
            {
                itemsstring=graphics[i].attributes["code"];              
            }
            else
            {
                itemsstring+=","+graphics[i].attributes["code"];              
            } 
            icout++;
        }  
    }
    if(icout>0)
    {
        /*
        var SeletItems="{\"items\":["+itemsstring+"]}";
        return SeletItems
        */
        return itemsstring;
    }
    else
    {
        return "";        
    }
}


//自动获取当前未使用的颜色 如果返回-1则说明无可用颜色
function GetColorIndex(id)
{
    //dicLineColors[0]="0";
    //dicLineColors[1]="1";
    for(var i=0;i<dicColors.length;i++)
    {
        if(dicLineColors[i]==strNull)
        {
            dicLineColors[i]=id; //设置dicLineColors字典的键值 表示颜色已经被占用
            return i;
        }
    }
    return -1;
}

//重置dicLineColors字典的键值为strNull 删除线路时需要
function ResetSetColorIndex(id)
{
    for(var i=0;i<dicLineColors.length;i++)
    {
        if(dicLineColors[i]==id)
        {
            dicLineColors[i]=strNull; //重置dicLineColors字典的键值为strNull
            return i;
        }
    }
}

//获取线颜色 当前线路设置的线颜色
function GetLineColor(id)
{
    for(var i=0;i<dicLineColors.length;i++)
    {
        if(dicLineColors[i]==id)
        {
            return dicColors[i];
        }
    }
}

//获取当前线路设置的车牌颜色
function GetCarNoColor(id)
{
    for(var i=0;i<dicLineColors.length;i++)
    {
        if(dicLineColors[i]==id)
        {
            return dicCarNOColors[i];
        }
    }
}

//设置地图显示区域
function SetAera(AreaInfo)
{
    try{
        var areaJson=eval('(' + AreaInfo + ')');
        //var initExtent = new esri.geometry.Extent({"xmin":areaJson.xmin,"ymin":areaJson.ymin,"xmax":areaJson.xmax,"ymax":areaJson.ymax, new SpatialReference({wkid:4326})}); 
        var initExtent = new esri.geometry.Extent(areaJson.xmin,areaJson.ymin,areaJson.xmax,areaJson.ymax, new SpatialReference({wkid:4326}));  
        map.extent = esri.geometry.geographicToWebMercator(initExtent);
        return "{\"returncode\":0,\"reason\":\"成功\"}";
    }
    catch(err)
    {
        return "{\"returncode\":1,\"reason\":\""+err.message+"\"}";          
    }
}

//初始化样式
dojo.require("esri/symbols/PictureMarkerSymbol"); 
function SetStyles(StylesInfo)
{
    var stylesJson=eval('(' + StylesInfo + ')');
    dicsymbol.length=0;//清空
    var items= stylesJson.items;  
    for(var i=0;i<items.length;i++){ 
        try
        {
            var p=items[i];
            var ico="img/"+p.ico;
            var width=p.width;
            var height=p.height;
            var skey=p.key;
            var symbol = new esri.symbol.PictureMarkerSymbol(ico, width,height); //esri.symbols.
            dicsymbol[skey]=symbol;            
        }
        catch(err)
        {
            alert(err.message);            
        }
    }
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//选中
function SetPoint(PointInfo) {
    var graphics = bayonetLayer.graphics;
    var pointJson=eval('(' + PointInfo + ')');
    var setgraphics=pointJson.items;
    for(var i= 0;i<graphics.length;i++){  
        for(var j=0,jtotal=setgraphics.length;j<jtotal;j++){
            if(graphics[i].attributes["id"]==setgraphics[j].id)
            {
                if(dicsymbol[setgraphics[j].key])
                {
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
    var pointJson=eval('(' + PointInfo + ')');
    var setgraphics=pointJson.items;
    for(var i= 0;i<graphics.length;i++){  
        for(var j=0,jtotal=setgraphics.length;j<jtotal;j++){
            if(graphics[i].attributes["id"]==setgraphics[j].id)
            {
                if(dicsymbol[setgraphics[j].key])
                {
                    graphics[i].setSymbol(commonSymbol_1);            
                }
            }
        }
    }
    bayonetLayer.redraw(); //刷新图层
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//高亮区域
function HightlightZone (id)
{
    //selectzonesymbol
    for(var j=0;j<map.graphics.graphics.length;j++)
    {
        var gtemp=map.graphics.graphics[j];
        if(gtemp.attributes)
        {
            if(id==gtemp.attributes["id"])
            {
            gtemp.symbol=selectzonesymbol;
            }
            else
            {
            gtemp.symbol=defaultzonesymbol;        
            }
        }         
    }
    map.graphics.redraw();
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//删除区域
function DeleteZone(id)
{
    var delgraphic=GetZoneGraphic(id);
    if(delgraphic)
    {
        var icout=0;
        var itemsstring="";
        var graphics = bayonetLayer.graphics; 
        /*
        var csymbol=defaultsymbol;
        try
        {
            csymbol=dicsymbol[PointInfo.key];
        }catch(err)
        {}
        */
        for(var i= 0;i<graphics.length;i++){  
            if(delgraphic.geometry.contains(graphics[i].geometry)){ 
                //判断在其他区域中不存在
                var bfind=false;
                for(var j=0;j<map.graphics.graphics.length;j++)
                {
                    var gtemp=map.graphics.graphics[j];
                    if(gtemp.attributes)
                    {
                        if(delgraphic.attributes["id"]!=gtemp.attributes["id"]&&gtemp.geometry.contains(graphics[i].geometry))
                        {
                        bfind=true;
                        break;
                        }                
                    }         
                }
                //未被其他区域选中
                if(!bfind)
                {
                    if( graphics[i]==graphicSelected)
                    {
                        graphics[i].setSymbol(commonSymbol_3);
                    }
                    else
                    {
                        graphics[i].setSymbol(commonSymbol_1);                        
                    }
                    
                    icout++;
                    if(itemsstring.length==0)
                    {
                        itemsstring="{\"id\":\""+graphics[i].attributes["id"]+"\"}";              
                    }
                    else
                    {
                        itemsstring+=",{\"id\":\""+graphics[i].attributes["id"]+"\"}";              
                    }
                    //currentlayer.redraw();             
                }  
            }  
        }
        map.graphics.remove(delgraphic);
        bayonetLayer.redraw();
        if(icout>0)
        {
            //selzoneindex++;
            var SeletItems="{\"items\":["+itemsstring+"]}";
            callcshar("PointUnSelected",SeletItems);//调用外部
            //callcshar("ZoneUnSelected",id);//调用外部
        }
    } 
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

function bayonetSelected(gbayonet)
{
    for(var i=0;i<selectedGraphics.length;i++)
    {
        if(gbayonet==selectedGraphics[i])
        {
            return true;
        }
    }
    return false;
}

//清除所有选择集
function ClearSelectedPoint () {
    historyPointLayer.clear();
    map.graphics.clear();
    for(var i= 0, total=selectedGraphics.length;i<total;i++){  
        selectedGraphics[i].setSymbol(commonSymbol_1);
    }  
    selectedGraphics=[];  
    toolbar.activate(null);
    bayonetLayer.redraw();
    closeSelLayer.clear();    
    map.showZoomSlider();
    callcshar("ClearSelected","");
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//dojo.require("esri/graphic");
function GetZoneGraphic(id) {
    for(var j=0;j<map.graphics.graphics.length;j++)
    {
        var gtemp=map.graphics.graphics[j];
        if(gtemp.attributes)
        {
            if(id==gtemp.attributes["id"])
            {
            return gtemp;
            }
        }
    }
    return "{\"returncode\":0,\"reason\":\"成功\"}";
}

//调用外部c#接口
function callcshar(methodname,param) {
    try
    {
        //alert(methodname+":"+param);
        window.external.RaiseEvent(methodname,param);
    }
    catch(err)
    {}
}

//创建graphic菜单
function createGraphicsMenu() {
    // Creates right-click context menu for GRAPHICS
    //创建右键菜单并添加删除选区选项
    require([
                "dijit/Menu","dijit/MenuItem","esri/geometry/jsonUtils"],function(Menu,MenuItem,jsonUtils)
                {
                    ctxMenuForGraphics = new Menu({});
                    ctxMenuForGraphics.addChild(new MenuItem({ 
                        label: "删除选区",
                        onClick: function() {
                            var sid=selected.attributes["id"];
                            DeleteZone(sid);
                        }
                    }));
                    
                    ctxMenuForGraphics.startup();
                    
                    //鼠标移动到图元上绑定菜单
                    map.graphics.on("mouse-over", function(evt) {
                        selected = evt.graphic;       
                        ctxMenuForGraphics.bindDomNode(evt.graphic.getDojoShape().getNode());
                    });
                    
                    //鼠标移出图元解除菜单
                    map.graphics.on("mouse-out", function(evt) {
                        ctxMenuForGraphics.unBindDomNode(evt.graphic.getDojoShape().getNode());
                    });
                }
            );
    
}

//创建地图菜单
function createMapMenu() {
    require(["dijit/Menu","dijit/MenuItem","esri/geometry/jsonUtils"],function(Menu,MenuItem,jsonUtils)
                {
                    ctxMenuForMap = new Menu({
                        onOpen: function(box) {
                        }
                    });
                    
                    //设置地图中点
                    ctxMenuForMap.addChild(new MenuItem({ 
                        label: "设为中点",
                        onClick: function(evt) {
                            var p=new esri.geometry.ScreenPoint(evt.clientX,evt.clientY);
                            var pt=map.toMap(p);
                            //var pt = mapEvent.mapPoint;
                            map.centerAt(pt);
                        }
                    }));
                    
                    //清除
                    ctxMenuForMap.addChild(new MenuItem({ 
                        label: "清除所有",
                        onClick: function(evt) {
                            toolbar.deactivate();
                            distancetool.deactivate();
                            ClearSelectedPoint(); //清除所有选择
                        }
                    }));
                    
                    ctxMenuForMap.startup();
                    ctxMenuForMap.bindDomNode(map.container);
                }
            );
    
}

//添加聚集图元
function AddClusters(ClusterPoints)
{
  require(  
        [ "dojo/ready", "asppro/gis/ClusterHelper" ],  
        function(ready, ClusterHelper) {  
            ready(function() {  
                ClusterHelper.AddClusterPoints(ClusterPoints);
            });  
        }); 
}

//跳转到前一视图
function PrevExtentView()
{
    navToolbar.zoomToPrevExtent();    
}

//跳转到下一视图
function NextExtentView()
{
    navToolbar.zoomToNextExtent();
}

function buildLayerList(layer) {
　　//构建图层树形结构
　　var layerinfos = layer.layerInfos ;
    var treeList = [] ;//jquery-easyui的tree用到的tree_data.json数组
    var parentnodes = [] ;//保存所有的父亲节点
    var root = {"id":"rootnode","text":"所有图层","children":[]} ;//增加一个根节点
    var node = {} ;
    if (layerinfos != null && layerinfos.length > 0) {
        
        for(var i=0,j=layerinfos.length;i<j;i++){
            var info = layerinfos[i] ;
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

function getChildrenNodes(parentnodes, node){
        for (var i = parentnodes.length - 1; i >= 0; i--) {
        
        var pnode = parentnodes[i];
        //如果是父子关系，为父节点增加子节点，退出for循环
        if (pnode.id==node.pid) {
            pnode.state="closed" ;//关闭二级树
            pnode.children.push(node) ;
            return ;
        } else {
            //如果不是父子关系，删除父节点栈里当前的节点，
            //继续此次循环，直到确定父子关系或不存在退出for循环
            parentnodes.pop() ;
        }
    }
}
// 地点数据数组
var initialLocations = 
  [
    {title:'中山大学', position: {lat: 23.066250, lng: 113.389530}},
    {title:'广州大学', position: {lat: 23.040730, lng: 113.370720}},
    {title:'广东药学院', position: {lat: 23.055450, lng: 113.411850}},
    {title:'广东工业大学', position: {lat: 23.037400, lng: 113.397230}},
    {title:'广州美术学院', position: {lat: 23.037470, lng: 113.382890}},
    {title:'华南理工大学', position: {lat: 23.047820, lng: 113.406610}},
    {title:'星海音乐学院', position: {lat: 23.057970, lng: 113.380530}},
    {title:'华南师范大学', position: {lat: 23.052060, lng: 113.378970}},
    {title:'广州中医药大学', position: {lat: 23.059160, lng: 113.406260}},
    {title:'广东外语外贸大学', position: {lat: 23.065650, lng: 113.398050}}
  ];

// 创建地图
function initMap() {
  
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 23.050130, lng: 113.389860},
    zoom: 14
  });

  var myVM = new ViewModel();

  // 保持视野中心
  google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
  });

  initialLocations.forEach(function(location) {
    var marker = new google.maps.Marker({
      position: location.position,
      map: map,
      title: location.title,
      animation: google.maps.Animation.DROP
    });

    myVM.markersMap.set(location.title, marker);

    marker.addListener("click", function() {
      if (!$.isEmptyObject(myVM.isBouncing)) {
        myVM.noBouncing(location.title);
      }

      myVM.bounceMarker(location.title);

      myVM.openInfowindow(location.title);
    });

    myVM.titleList.push(location.title);

  });

  myVM.infoWindow = new google.maps.InfoWindow({
    content: ''
  });


  google.maps.event.addListener(map, "click", function() {
    if(!$.isEmptyObject(myVM.isBouncing)) {
      myVM.noBouncing(location.title);
    }

    myVM.infoWindow.close();
  })

  ko.applyBindings(myVM);
    
};

// google map错误提示函数
var googleMapErrorHandler = function() {
  alert("错误: Google map加载失败");
};


var myMap = function() {

  this.map = {};

  this.set = function(key, value){
    this.map[key] = value;
  };

  this.get = function(key){
    return this.map[key];
  };

  this.values = function(){
    var values = [];
    $.each(this.map, function(key, value) {
        values.push(value);
    });
    return values;
  };

  this.containsKey = function(key) {
    for (var k in this.map) {
      if (k.indexOf(key) != -1) {
        return true;
      }
    }
    return false;
  };
  
};

var ViewModel = function() {

  var self = this;

  this.inputStr = ko.observable('');

  this.titleList = ko.observableArray([]);

  this.infoWindow = {};

  this.isBouncing = {};

  this.markersMap = new myMap();

  // 筛选按钮功能函数
  this.filterClick = function(inputStr) {

    var searchStr = "";
    
    // 若筛选列表不为空，移除列表上的元素
    if (self.titleList() !== null && self.titleList() !== "") {
      self.titleList.removeAll();

      // 停止在跳动的Marker
      if (!$.isEmptyObject(self.isBouncing)) {
        self.isBouncing.setAnimation(null);
      }

      // 关闭已打开的infowindow
      self.infoWindow.close();

      // 隐藏所有Marker
      self.markersMap.values().forEach(function(marker) {
        marker.setVisible(false);
      });
    }

    // 若没有匹配到输入内容，显示所有Marker并弹出提示信息
    if (!self.markersMap.containsKey(self.inputStr())) {
      self.showAllMarkers();
      alert("没有找到你所输入的地址");
    }
    // 循环initialLocations，若有能够与输入值匹配的title，则加入到筛选列表并显示其Marker
    else {
      initialLocations.forEach(function(location) {
        if (location.title.indexOf(self.inputStr()) != -1) {
          searchStr = location.title;
          self.titleList.push(location.title);
          self.markersMap.get(location.title).setVisible(true);
        }
      });
    }

    // 若输入框为空，显示所有Marker
    if (self.inputStr() === "") {
      self.showAllMarkers();
    }

    // 若筛选列表中只有一个选项，则使其相对应的Marker跳动并打开infowindow
    if (self.titleList() !== null && self.titleList().length === 1) {
      self.bounceMarker(searchStr);
      self.openInfowindow(searchStr);
    }

  };

  // 为Marker添加跳动动画
  this.bounceMarker = function(title) {

    // 停止已经在跳动的MArker
    if (!$.isEmptyObject(self.isBouncing)) {
      self.noBouncing(title);
    }

    // 设置新的跳动Marker
    self.isBouncing = self.markersMap.get(title);

    // 添加动画
    self.markersMap.get(title).setAnimation(google.maps.Animation.BOUNCE);
  };
  
  // 停止Marker跳动
  this.noBouncing = function(title) {

    self.isBouncing.setAnimation(null);

    self.isBouncing = self.markersMap.get(title)
  };

  // 显示所有Marker
  this.showAllMarkers = function() {

    initialLocations.forEach(function(location) {
      self.markersMap.get(location.title).setVisible(true);
    });
  };

  // 打开infowindow
  this.openInfowindow = function(title) {

    var marker = self.markersMap.get(title);

    // 关闭当前已打开的infowindow
    self.infoWindow.close();

    self.infoWindow.setContent(title);

    self.infoWindow.open(marker.map, marker);

  };

  //汉堡菜单点击功能
  this.slideToggle = function() {
    $("#options-box").animate({width: 'toggle'}, 'fast'); 
  };
  
};

// 天气预报api
(function loadWeather() {

  var $weatherElem = $('#weather');

  var weatherURL = 'https://free-api.heweather.com/v5/weather?city=guangzhou&key=89537d5a797f4c009789d1c8f9a5ec14';
  
  $.ajax({
    url: weatherURL,
    dataType: "json"
  })
  .done(function(data) {

    var date = data.HeWeather5[0].daily_forecast[0].date;
    var aqi = data.HeWeather5[0].aqi.city.aqi;
    var qlty = data.HeWeather5[0].aqi.city.qlty;
    var min = data.HeWeather5[0].daily_forecast[0].tmp.min;
    var max = data.HeWeather5[0].daily_forecast[0].tmp.max;
    var cond = data.HeWeather5[0].daily_forecast[0].cond.txt_d;
    var trav = data.HeWeather5[0].suggestion.trav.brf;
    $weatherElem.append( '<p id="weatherP">' + '当前地区天气状况：' + '<br>' +
                          date + '<br>' +
                          '实时空气质量: ' + aqi + ' ' + qlty + '<br>' +
                          min + ' ~ ' + max + '℃' + ' ' + cond + '<br>' +
                          '旅游指数: ' + trav + '</p>' );
    

  })
  .fail(function(e) {
    $weatherElem.text('天气预报加载失败');
  });
})();



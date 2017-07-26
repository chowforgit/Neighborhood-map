	/*//创建地图对象
		var map = new AMap.Map('map', {
	            center: [113.389860,23.050130],
	            zoom: 14,
	            mapStyle: 'amap://styles/macaron'
	        });

		//添加工具条
		AMap.plugin(['AMap.ToolBar','AMap.Scale'],function(){
	            map.addControl(new AMap.ToolBar());
	            map.addControl(new AMap.Scale());
	    });

		
		// 创建默认标记样式和高亮标记样式
		var defaultIcon = 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
		var highlightedIcon = 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png';

		//创建默认信息窗体
		var infowindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});

		//创建标记
		initialLocations.forEach(function(marker) {
        	var newMarker = new AMap.Marker({
        		icon: defaultIcon,
        		map: map,
        		position: [marker.position[0], marker.position[1]],
        		title: marker.title,
        		offset: new AMap.Pixel(-12,-36)
        	});
        	newMarker.content = '我是' + marker.title;
        	// 为标记设置动画
        	newMarker.setAnimation('AMAP_ANIMATION_DROP');
        	// 设置鼠标移入和移出标记的图标状态
        	newMarker.on('mouseover', function() {
        		this.setIcon(highlightedIcon);
        	});
            newMarker.on('mouseout', function() {
            	this.setIcon(defaultIcon);
            });
            // 为标记绑定 点击事件
	       	newMarker.on('click', markerClick);
        });



		// 点击事件方法主体
        function markerClick(e) {
        	infowindow.setContent(e.target.content);
        	infowindow.open(map, e.target.getPosition());
        }

        // 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
        map.setFitView();*/


var map = new AMap.Map('map', {
        center: [113.389860,23.050130],
        zoom: 14,
        mapStyle: 'amap://styles/macaron'
    });

//添加工具条
AMap.plugin(['AMap.ToolBar','AMap.Scale'],function(){
        map.addControl(new AMap.ToolBar());
        map.addControl(new AMap.Scale());
});
var markers = [];
var largeInfowindow = new AMap.InfoWindow({
	content: 'hi',
	offset: new AMap.Pixel(0, -30)
});

for (var i = 0;i < initialLocations.length;i++) {
	var position = initialLocations[i].position;
	var title = initialLocations[i].title;
	var marker = new AMap.Marker({
		map: map,
		position: position,
		title: title,
		animation: 'AMAP_ANIMATION_DROP',
		id: i,
	});
	markers.push(marker);
	marker.on('click', function(){
		populateInfoWindow(this,largeInfowindow);
	});
}
// 点击事件方法主体
function populateInfoWindow(marker, infowindow) {
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		infowindow.open(map, marker.getPosition());
		infowindow.on('closeclick', function(){
			infowindow.setMarker(null);
		});
		
	}
}









// 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
map.setFitView();


        

        


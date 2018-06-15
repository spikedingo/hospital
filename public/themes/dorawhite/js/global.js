

// 最小高度初始化
$(function() {
	var windowHeight = $(window).height();
	var headerHeight = $('.header-wrap').height();
	var footerHeight = $('#footer').height();

	var minHeight = windowHeight - headerHeight - footerHeight;
	$('.body-wrap').css('minHeight', minHeight)
	if (true) {}
})


// 首页科室切换
$(function() {
	$('.nav-btn').each(function(i,x) {
		$(x).click(function(e) {
			var target = $(this).data('target')

			console.log(target, 'target')
			$('div.department-group').hide()
			$('div.department-group.'+target).show()

			$('.nav-btn').removeClass('active')
			$(this).addClass('active')
		})
	})
})

//

//导航页板块切换
$(function() {
	$('.single-guide').click(function(e) {
		var location = $(this).data('for')

		if (location) {
			changeGuideBlocks(location)
		}
	})
})

function changeGuideBlocks(location) {
	$('.sections-wrap').removeClass('active')
	$('.sections-wrap.'+location).addClass('active')

	$('.single-guide').removeClass('active')
	$('.single-guide.'+location).addClass('active')

	if (location == 'position') {
		loadJScript(initBmap);
	}
}

//导航页文章切换
$(function() {
	$('li.single-list').click(function(e) {
		var contentsWrap = $(this).parents('.sections-wrap').find('.right-section')

		contentsWrap.find('.single-content').hide()
		contentsWrap.find('.single-content').eq($(this).index()).show()
		
		$('li.single-list').removeClass('active')
		$(this).addClass("active");
	})
})

//医生显示简介

$(function() {
	$('.single-doctor').click(function(e) {
	    var doctor = $(this).data('doctor')
	    var professional = $(this).data('professional')
	    var simg = $(this).data('simg')
	    var description = $(this).data('description')
	    var department = $(this).data('department')

	    $('#doctorModal').find('.doctor').html(doctor)
	    $('#doctorModal').find('.professional').html(professional)
	    $('#doctorModal').find('.photo').attr('src',simg)
	    $('#doctorModal').find('.description').html(description)
	    $('#doctorModal').find('.department').html('所属科室：'+department)

	    console.log(doctor)
	    $('#doctorModal').modal('show');

	})
})

function loadJScript(callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=ytfwSaBsiXqhB4ucZINYRmyr&callback=initBmap";
    var script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.src = "/javascripts/bmaplib.js";
    var css1 = document.createElement('link');
    css1.rel = "stylesheet";
    css1.href = "http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css";
    document.body.appendChild(css1);
    document.body.appendChild(script1);
    document.body.appendChild(script)
}
function initBmap() {
	console.log($('#mapGuide2'))
    var map = new BMap.Map("mapGuide2",{minZoom:10,maxZoom:18});
    var poi = new BMap.Point(118.558441,30.309191);
    map.addControl(new BMap.MapTypeControl());
    map.centerAndZoom(poi,15);                 
    map.enableScrollWheelZoom(true);
    // var marker = new BMap.Marker(poi);  // 创建标注
    // map.addOverlay(marker);               // 将标注添加到地图中
    // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

    // var content = '<div style="margin:0;line-height:20px;padding:2px;">' +
    //                 '地址：旌德县旌阳镇河东路191号<br/>电话：(0563)8022120<br/>简介：旌德县人民医院始建于1980年12月，是一所集医疗、教学、康复、急诊于一体的综合性医院' +
    //               '</div>';

    //创建检索信息窗口对象
    var searchInfoWindow = null;
    // searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
    //         title  : "旌德县人民医院",      //标题
    //         width  : 290,             //宽度
    //         height : 105,              //高度
    //         panel  : "panel",         //检索结果面板
    //         enableAutoPan : true,     //自动平移
    //         searchTypes   :[
    //             // BMAPLIB_TAB_SEARCH,   //周边检索
    //             // BMAPLIB_TAB_TO_HERE,  //到这里去
    //             // BMAPLIB_TAB_FROM_HERE //从这里出发
    //         ]
    //     });
    var marker = new BMap.Marker(poi); //创建marker对象
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    marker.addEventListener("mouseover", function(e){
        console.log(marker)
    })
    marker.addEventListener("click", function(e){
        marker.setAnimation();
        //searchInfoWindow.open(marker);
    })
    map.addOverlay(marker); //在地图中添加marker
}





// 最小高度初始化
$(function() {
	var windowHeight = $(window).height();
	var headerHeight = $('.header-wrap').height();
	var footerHeight = $('#footer').height();

	var minHeight = windowHeight - headerHeight - footerHeight;
	$('.body-wrap').css('minHeight', minHeight)
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

//导航页板块切换
$(function() {
	$('.single-guide').click(function(e) {
		var page = $(this).data('for')

		$('.sections-wrap').removeClass('active')
		$('.sections-wrap.'+page).addClass('active')

		$('.single-guide').removeClass('active')
		$(this).addClass('active')
	})
})

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



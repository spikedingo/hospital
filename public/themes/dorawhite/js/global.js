

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

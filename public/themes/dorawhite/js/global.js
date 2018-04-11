
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

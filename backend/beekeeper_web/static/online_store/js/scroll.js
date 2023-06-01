scroll_top = 0
$(window).scroll(function(){
	if($(window).width() >=701){
		menu_scroll_ev(50)
	}else{
menu_scroll_ev(10)
	}
    

})

function menu_scroll_ev(px){
	if (window.scrollY > scroll_top){
        scroll_top = window.scrollY
        $('.logo-page').css({"top":`-${px}px`,"opacity":"0.5"})
    }else{
        scroll_top = window.scrollY
        $('.logo-page').css({"top":"0px","opacity":"1"})
    }
}
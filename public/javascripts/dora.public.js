/**
 * Created by Administrator on 2015/11/16.
 */
$(function(){

    $('#selectAll').click(function(){
        if($(this).prop('checked')){
            $('.datalist input[name=listItem]').prop('checked',true);
        }else{
            $('.datalist input[name=listItem]').prop('checked',false);
        }
        getSelectIds();
    });

    // (function formatDate(){
    //     $('.hotItemDate').each(function(i,x){
    //         var html = $(x).html();
    //         $(x).html(moment(new Date(html)).format('MM-DD'));
    //         $(x).show();
    //     })
    // })();

    (function formatText(){
        $('.picContent').find('p').each(function(i,x){
            var innerText = $(x).html();
            if (innerText.length > 100) {
                var cutText = innerText.slice(0,100)+'...';
                $(x).html(cutText);
            };
        })
    })();

    (function picNewsSlide(){
        $('.picDiv').first().addClass('active');
        $('.sImgUl').find('li').first().addClass('active');
        $('#myCarousel1').carousel();
    })();

    (function topicNewsSlide(){
        $('#myCarousel').carousel();
    })();

    (function stopDrag(){
        $('img').on('mousedown',function(){
            return false;
        })
    })();

    // (function navDropDown(){
    //     $('.navigation_bar').find('.dropdown').on('mouseover',function(){
    //         var oHeight = $('.navigation_bar').find('.dropdown-menu').height();
    //         $('.navigation_bar').find('.dropdown-menu').show();
    //     })
    //     $(document).on('click',function(e){
    //         $('.navigation_bar').find('.dropdown-menu').hide();
    //     });
    // })();

    patientService();

    departmentChange();

    docListShow();

    initDocListHeight();

});

function getSelectIds(){
    var checkBoxList = $(".datalist input[name='listItem']:checkbox");
    var ids = '';
    var nids = '';
    if(checkBoxList.length>0){
        $(checkBoxList).each(function(i){
            if (true == $(this).prop("checked")) {
                ids += $(this).prop('value') + ',';
                if($(this).attr('nid')){
                    nids += $(this).attr('nid') + ',';
                }

            }
        });
        $('#targetIds').val(ids.substring(0,ids.length - 1));
        $('#expandIds').val(nids.substring(0,nids.length - 1));
    }
}


//angularJs https Post方法封装
function angularHttpPost($http,isValid,url,formData,callBack){
    if(isValid){
        $http({
            method  : 'POST',
            url     : url,
            data    : $.param(formData),  // pass in data as strings
            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
        })
        .success(function(data) {
            //  关闭所有模态窗口
            $('.modal').each(function(i){
                $(this).modal("hide");
            });

            if(data == 'success'){
                callBack(data);
            }else{
                $.tipsShow({ message : data, type : 'warning' });
            }
        });
    }
    else{
        $.tipsShow({ message : "参数校验不通过", type : 'warning' });
    }
}


/*初始化上传图片按钮
* id 初始化上传按钮
* type 文件类型
* key 上传对象是所属 管理员头像、用户头像、文档首图等，后台根据key来进行不同规格的图片压缩
* */
function initUploadFyBtn(id,type,key,callBack){

    var typedes = 'Image Files';
    var filtertype = '*.gif; *.jpg; *.png';
    var buttonText = '上传图片';
    var uploadApi = '/system/upload';
    var autoUpdate = true;
    var sizeLimit = 1024 * 1024 * 1;
    var adminId = $('#adminId').val();
    var buttonWidth = 100;
    var buttonStyle = 'uploadify-btn-default';
    if(type == 'zip'){
        typedes = 'Zip Files';
        filtertype = '*.zip';
        buttonText = '安装本地模板(*.zip)';
        uploadApi = '/admin/manage/updateCMSTemplate';
        sizeLimit = 1024 * 1024 * 3;
        buttonWidth = 130;
        buttonStyle = 'uploadify-btn-primary';
    }
    $("#"+id).Huploadify({
        //指定swf文件
        'swf': '/plugins/uploadify/uploadify.swf',
        //后台处理的页面
        'uploader': uploadApi + '?adminId='+adminId+'&type='+type+'&key='+key,
        //按钮显示的文字
        'buttonText': buttonText,
        'buttonClass' : buttonStyle,
        //显示的高度和宽度，默认 height 30；width 120
        //'height': 15,
        'width': buttonWidth,
        //上传文件的类型  默认为所有文件    'All Files'  ;  '*.*'
        //在浏览窗口底部的文件类型下拉菜单中显示的文本
        'fileTypeDesc': typedes,
        //允许上传的文件后缀
        'fileTypeExts': filtertype,
        //发送给后台的其他参数通过formData指定
        //'formData': { 'adminUserId' : adminUserId , 'type': type, 'key': key},
        sizeLimit :sizeLimit,
    //上传文件页面中，你想要用来作为文件队列的元素的id, 默认为false  自动生成,  不带#
        //'queueID': 'fileQueue',
        //选择文件后自动上传
        'auto': autoUpdate,
        //设置为true将允许多文件上传
        'multi': false,
        //上传成功
        'onUploadSuccess' : function(file, data, response) {
            if(data === 'typeError'){
                $.tipsShow({
                    message : "文件类型不正确，请重试！",
                    type : 'warning',
                    callBack : function(){
                        return;
                    }
                });
            }else {
                console.log(callBack);
                callBack(data);
            }
        },
        'onComplete': function(event, queueID, fileObj, response, data) {//当单个文件上传完成后触发
            //event:事件对象(the event object)
            //ID:该文件在文件队列中的唯一表示
            //fileObj:选中文件的对象，他包含的属性列表
            //response:服务器端返回的Response文本，我这里返回的是处理过的文件名称
            //data：文件队列详细信息和文件上传的一般数据
            alert("文件:" + fileObj.name + " 上传成功！");
        },
        //上传错误
        'onUploadError' : function(file, errorCode, errorMsg, errorString) {
            alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
        },
        'onError': function(event, queueID, fileObj) {//当单个文件上传出错时触发
            alert("文件:" + fileObj.name + " 上传失败！");
        }
    });
}

//患者服务切换功能
function patientService(){
    var pBtn = $('.innerBoard');
    var pContent = $('.patientCell');
    pContent.each(function(i,x){
        $(x).css('display','none');
        $(x).css('opacity',0);
    });
    pContent.first().addClass('active');
    pContent.first().css('display','block');
    pContent.first().animate({opacity:1});
    pBtn.each(function(i,x){
        x.index = i;
        $(x).on('click',function(e){
            var a = $('.patientTotal').find('.active');
            var _this = this;
            if ( a.index() == _this.index ) {
                return;
            };
            a.removeClass('active');
            a.animate({opacity:0},function(){
                a.css('display','none');
                $(pContent[_this.index]).css('display','block');
                $(pContent[_this.index]).animate({opacity:1});
                $(pContent[_this.index]).addClass('active');  
                if (_this.index == 2) {
                    loadJScript();
                };  
            })
            
        })
    });
}

//切换不同科室功能
function departmentChange(){
    var $department = $('.departments').find('.departmentIntro');
    var $tableTd = $('.departments').find('td');
    $department.each(function(i,x){
        if ( i!==0 ) {
            $(x).hide();
        }else{
            textBeautiful(x);
            $(x).show();
        }
    })
    $tableTd.each(function(i,x){
        $(x).on('click',function(e){
            var _this = this;
            if (this.innerHTML == '') {
                return;
            };
            $department.each(function(i,x){
                var title = $(x).find('span').html();
                if (title == _this.innerHTML) { 
                    textBeautiful(x);
                    $(x).fadeIn();
                }else{
                    $(x).hide();
                }
            })
        })
    });

    //美化从数据库中取出的科室介绍，进行段落区分，首行缩进
    function textBeautiful(obj){
    if (obj.splited == 1) {
        return;
    };
    var splitedText = $(obj).find('.dDescription')[0].innerHTML.split('br');
        $(obj).find('.dDescription').html(splitedText.join('<br/>&nbsp&nbsp&nbsp&nbsp'));
        obj.splited = 1;
    }
}

/*
医生列表切换功能
-3个版块，默认显示专家栏
    点击别的版块时由ajax取出对应栏目的医生数据，每次最多取出6个
        ---点击下方“换一组”时如果还有医生的数据未取得则继续由ajax取出，如果没有则在现有版面轮流切换。
*/
function docListShow(){
    var $expertCell = $('.expertCell');
    var $clinicalCell = $('.clinicalCell');
    var $technologyCell = $('.technologyCell');
    var $switchBtn = $('.indexDoctor').find('.switchBtn');
    var switchBtnColor = ['#F95738','#EE964B','#2EC4B6'];

    //因默认显示专家栏所以初始化为医生中对应专家的编号-3 另临床科室医生为0，医技科室医生为1.
    var btnCellType = 3;

    //默认显示专家栏
    $expertCell.find('.docListCell').first().show();
    $expertCell.find('.docListCell').first().addClass('active');

    //点击不同分类则显示不同版块
    //为三个栏目的按钮绑定click事件
    $('.indexDoctor').find('.typeSwitch').each(function(i,x){
        x.index = i;
        $(x).on('click',function(e){
            switch (this.index) {
                case 0:
                    $('.indexDoctor').find('.typeSwitch').each(function(i,x){
                        $(x).css('background-color','#34495e');
                    });
                    $(x).css('background-color',switchBtnColor[this.index]);
                    showBigCell($expertCell,3);
                    break;
                case 1: 
                    $('.indexDoctor').find('.typeSwitch').each(function(i,x){
                        $(x).css('background-color','#34495e');
                    });
                    $(x).css('background-color',switchBtnColor[this.index]);
                    showBigCell($clinicalCell,0);
                    break;
                case 2: 
                    $('.indexDoctor').find('.typeSwitch').each(function(i,x){
                        $(x).css('background-color','#34495e');
                    });
                    $(x).css('background-color',switchBtnColor[this.index]);
                    showBigCell($technologyCell,1);
                    break;
            }
        })
    })

//每个分类板块下点击‘换一组’按钮获得相应版块的更多医生数据。
    $switchBtn.on('click',function(){
        switch (btnCellType) {
            case 0 :
                    var skipNum = $clinicalCell.find('.docListCell').length * 6;
                    getMoreDoctors($clinicalCell,btnCellType,skipNum);
                break;
            case 1 :
                    var skipNum = $technologyCell.find('.docListCell').length * 6;
                    getMoreDoctors($technologyCell,btnCellType,skipNum);
                break;
            case 3 :
                    var skipNum = $expertCell.find('.docListCell').length * 6;
                    getMoreDoctors($expertCell,btnCellType,skipNum);
                break;
        }
    });

    //分类版块切换函数(正在操作的版块，版块的类型)
    function showBigCell($obj,cellType){
        var $prev = $('.indexDoctor').find('.activeCell');
        $prev.fadeOut(function(){
            $prev.removeClass('activeCell');
            $obj.fadeIn();
            $obj.addClass('activeCell');

            //若版块下还没有医生则取数据
            if ($obj.find('.docListCell').length == 0) {
                $obj.skipNum = 0;
                getMoreDoctors($obj,cellType,$obj.skipNum);
                btnCellType = cellType;
            }else{
                btnCellType = cellType;
            }
        });
    }
}


//获取更多医生数据的ajax函数(正在操作的版块，版块的类型，需要在数据库中跳过的个数)
function getMoreDoctors($obj,cellType,skipNum){
    $.ajax({
        url: "/addDoctors?skipNum=" + skipNum + "&cellType=" + cellType,
        method: "GET",
        success: function (result) {
            if (result.length > 0) {
                var $oDiv = $('<div class="row docListCell" style="display:none;"><div>')
                var html = '';
                for (var i = 0; i < result.length; i++) {
                    html += '<div class="col-sm-6 col-md-6 col-lg-4" style="height:224px;">\
                                <div class="doctorCell">\
                                    <img src="'+ result[i].sImg +'">\
                                    <div class="introCell">\
                                        <h3 style="margin-top:16px;"><span style="color:#1B998B; font-weight:bold">医生：</span>'+
                                        result[i].doctor +'</h3>\
                                        <h3><span style="color:#3e92cc;">科室：</span>'+
                                        result[i].department +'</h3>\
                                        <h3 ><span style=" color:#E84855;">职称：</span>'+
                                        result[i].skillLevel +'</h3>\
                                        <h3><span style=" color:#ff8c42;">专长：</span>'+
                                        result[i].professional +'</h3>\
                                        <p><span style=" color:#1A535C;">医生简介：</span>'+
                                        result[i].description +'</p>\
                                    </div>\
                                </div>\
                            </div>';
                };
                $oDiv.html(html);
                if ($obj.find('.docListCell').length == 0) {
                    $obj.append($oDiv);
                    $oDiv.fadeIn();
                    $oDiv.addClass('active');
                }else{
                    $oDiv.insertAfter($obj.find('.docListCell').last());
                    //通过定时器来保证动画稳定性
                    var timer = setTimeout(function(){docShowAnimate($obj);},0);
                }   
            }else{
                docShowAnimate($obj);
            }
        }
    })
}

//各医生列表切换函数(正在操作的版块)
function docShowAnimate($obj){
    var $prev = $obj.find('.active');
    if ($prev[0] == $obj.find('.docListCell').last()[0]) {
        var $cellNow = $obj.find('.docListCell').first();
    }else{
        var $cellNow = $prev.next();
    }
    $prev.fadeOut(function(){       
        $prev.removeClass('active');
        $cellNow.fadeIn();
        $cellNow.addClass('active');
    });
}

//初始化医疗骨干高度，防止因医生个数不同导致高度变化而使页面布局出现抖动
function initDocListHeight(){
    if ($(window).width()>1170) {
        $('.indexDoctor').find('.bigCell').each(function(i,x){
            $(x).css('height','448px');
            if (!$(x).hasClass('activeCell')) {
                $(x).hide();
            }
        })
    }else if($(window).width()>750 && $(window).width()<1170) {
        $('.indexDoctor').find('.bigCell').each(function(i,x){
            $(x).css('height','672px');
            if (!$(x).hasClass('activeCell')) {
                $(x).hide();
            }
        })    
    }
}

function loadJScript() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "http://api.map.baidu.com/api?v=2.0&ak=ytfwSaBsiXqhB4ucZINYRmyr&callback=init";
    var script1 = document.createElement("script");
    script1.type = "text/javascript";
    script1.src = "http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.js";
    var css1 = document.createElement('link');
    css1.rel = "stylesheet";
    css1.href = "http://api.map.baidu.com/library/SearchInfoWindow/1.5/src/SearchInfoWindow_min.css";
    document.body.appendChild(css1);
    document.body.appendChild(script1);
    document.body.appendChild(script)
}

function init() {
    var map = new BMap.Map("mapGuide",{minZoom:10,maxZoom:20});
    var poi = new BMap.Point(118.551854,30.296638);
    map.addControl(new BMap.MapTypeControl());
    map.centerAndZoom(poi,18);                 
    map.enableScrollWheelZoom(true);
    // var marker = new BMap.Marker(poi);  // 创建标注
    // map.addOverlay(marker);               // 将标注添加到地图中
    // marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

    var content = '<div style="margin:0;line-height:20px;padding:2px;">' +
                    '地址：旌德县旌阳镇河东路191号<br/>电话：(0563)8022120<br/>简介：旌德县人民医院始建于1980年12月，是一所集医疗、教学、康复、急诊于一体的综合性医院' +
                  '</div>';

    //创建检索信息窗口对象
    var searchInfoWindow = null;
    searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
            title  : "旌德县人民医院",      //标题
            width  : 290,             //宽度
            height : 105,              //高度
            panel  : "panel",         //检索结果面板
            enableAutoPan : true,     //自动平移
            searchTypes   :[
                BMAPLIB_TAB_SEARCH,   //周边检索
                BMAPLIB_TAB_TO_HERE,  //到这里去
                BMAPLIB_TAB_FROM_HERE //从这里出发
            ]
        });
    var marker = new BMap.Marker(poi); //创建marker对象
    marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画
    marker.addEventListener("mouseover", function(e){
        marker.setAnimation();
    })
    marker.addEventListener("click", function(e){
        searchInfoWindow.open(marker);
    })
    map.addOverlay(marker); //在地图中添加marker
}
var express = require('express');
var router = express.Router();
var http = require('http');
var https = require('https');
var cheerio = require('cheerio');

//数据库操作对象
var DbOpt = require("../models/Dbopt");
// 文档对象
var Content = require("../models/Content");
// 科室对象
var Department = require("../models/Department");
//文章类别对象
var ContentCategory = require("../models/ContentCategory");
//短id
var shortid = require('shortid');
//校验
var validator = require("validator");
//时间格式化
var moment = require('moment');
//站点配置
var settings = require("../models/db/settings");
var siteFunc = require("../models/db/siteFunc");
var url = require('url');
//缓存
var cache = require('../util/cache');


/* GET home page. */
router.get('/', function (req, res, next) {
    console.log('getting index')
    siteFunc.renderToTargetPageByType(req,res,'index');
});

router.get('/getPage', function(req, res, next) { // 浏览器端发来get请求
    var page = req.params.page || 1;  //获取get请求中的参数 page
    console.log("page: "+page);
    var Res = res;  //保存，防止下边的修改
    //url 获取信息的页面部分地址
    // var url = 'https://www.lagou.com/jobs';
    var url = 'https://mp.weixin.qq.com/s/wNKTa7498h5nze4lrNTB5A'

    https.get(url,function(res){  //通过get方法获取对应地址中的页面信息
        var chunks = [];
        var size = 0;
        res.on('data',function(chunk){   //监听事件 传输
            chunks.push(chunk);
            size += chunk.length;
        });
        res.on('end',function(){  //数据传输完
            var data = Buffer.concat(chunks,size);  
            var html = data.toString();
            var $ = cheerio.load(html); //cheerio模块开始处理 DOM处理

            console.log($ , 'cheerio');
            var jobs = [];

            var article = {}
            var $fullArticle = $("#img-content")

            article.title = $fullArticle.find('#activity-name').text().trim()
            console.log(article.title, 'article')
            return false
            var jobs_list = $(".hot_pos li");
            $(".hot_pos>li").each(function(){   //对页面岗位栏信息进行处理  每个岗位对应一个 li  ,各标识符到页面进行分析得出
                var job = {};
                job.company = $(this).find(".hot_pos_r div").eq(1).find("a").html(); //公司名
                job.period = $(this).find(".hot_pos_r span").eq(1).html(); //阶段
                job.scale = $(this).find(".hot_pos_r span").eq(2).html(); //规模

                job.name = $(this).find(".hot_pos_l a").attr("title"); //岗位名
                job.src = $(this).find(".hot_pos_l a").attr("href"); //岗位链接
                job.city = $(this).find(".hot_pos_l .c9").html(); //岗位所在城市
                job.salary = $(this).find(".hot_pos_l span").eq(1).html(); //薪资
                job.exp = $(this).find(".hot_pos_l span").eq(2).html(); //岗位所需经验
                job.time = $(this).find(".hot_pos_l span").eq(5).html(); //发布时间

                console.log(job.name);  //控制台输出岗位名
                jobs.push(job);  
            });
            Res.json({  //返回json格式数据给浏览器端
                jobs:jobs
            });
        });
    });
});

//缓存站点地图
router.get("/sitemap.html", function (req, res, next) {
    var siteMapNeedData;
    cache.get(settings.session_secret + '_siteMapHtml',function(siteMapHtml){
       if(siteMapHtml) {
           siteMapNeedData = siteMapHtml;
           siteFunc.renderToTargetPageByType(req,res,'sitemap',{docs : siteMapNeedData});
       }else{
           Content.find({'type': 'content','state' : true},'title',function(err,docs){
               if(err){
                   res.end(err);
               }else{
                   siteMapNeedData = docs;
                   cache.set(settings.session_secret + '_siteMapHtml', docs, 1000 * 60 * 60 * 24); // 缓存一天
                   siteFunc.renderToTargetPageByType(req,res,'sitemap',{docs : siteMapNeedData});
               }
           })
       }
    });
});


//文档详情页面
router.get('/details/:url', function (req, res, next) {

    var url = req.params.url;
    var currentId = url.split('.')[0];
    if(shortid.isValid(currentId)){
        Content.findOne({ '_id': currentId , 'state' : true}).populate('category').populate('author').exec(function(err,result){
            if (err) {
                console.log(err)
            } else {
                if (result) {
//                更新访问量
                    result.clickNum = result.clickNum + 1;
                    result.save(function(){
                        var cateParentId = result.sortPath.split(',')[1];
                        var cateQuery = {'sortPath': { $regex: new RegExp(cateParentId, 'i') }};

                        siteFunc.getContentsCount(req,res,cateParentId,cateQuery,function(count){
                            siteFunc.renderToTargetPageByType(req,res,'detail',{count : count, cateQuery : cateQuery, detail : result});
                        });

                    })
                } else {
                    siteFunc.renderToTargetPageByType(req,res,'error',{info : '非法操作!',message : settings.system_illegal_param, page : 'do404'});
                }
            }
        });
    }else{
        siteFunc.renderToTargetPageByType(req,res,'error',{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
    }
});

// 预览文章页面
router.get('/previews/:url', function (req, res, next) {
    console.log('gettingg')
    var url = req.params.url;
    var currentId = url.split('.')[0];
    if(shortid.isValid(currentId)){
        Content.findOne({ '_id': currentId , 'state' : false}).populate('category').populate('author').exec(function(err,result){
            if (err) {
                console.log(err)
            } else {
                if (result) {
//                更新访问量
                    result.clickNum = result.clickNum + 1;
                    result.save(function(){
                        var cateParentId = result.sortPath.split(',')[1];
                        var cateQuery = {'sortPath': { $regex: new RegExp(cateParentId, 'i') }};

                        siteFunc.getContentsCount(req,res,cateParentId,cateQuery,function(count){
                            siteFunc.renderToTargetPageByType(req,res,'detail',{count : count, cateQuery : cateQuery, detail : result});
                        });

                    })
                } else {
                    siteFunc.renderToTargetPageByType(req,res,'error',{info : '非法操作!',message : settings.system_illegal_param, page : 'do404'});
                }
            }
        });
    }else{
        siteFunc.renderToTargetPageByType(req,res,'error',{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
    }
});

// 科室详情页
router.get('/department/:url', function (req, res, next) {

    var url = req.params.url;
    var currentId = url.split('.')[0];
    if(shortid.isValid(currentId)){
        Department.findOne({ '_id': currentId }).exec(function(err,result){
            if (err) {
                console.log(err)
            } else {
                console.log(result, 'result')
                if (result) {
//                更新访问量
                    result.save(function(){
                        //var cateParentId = result.sortPath.split(',')[1];
                        //var cateQuery = {'sortPath': { $regex: new RegExp(cateParentId, 'i') }};

                        //siteFunc.getContentsCount(req,res,cateParentId,cateQuery,function(count){});
                        siteFunc.renderToTargetPageByType(req,res,'departmentDetail',{department : result});

                    })
                } else {
                    siteFunc.renderToTargetPageByType(req,res,'error',{info : '非法操作!',message : settings.system_illegal_param, page : 'do404'});
                }
            }
        });
    }else{
        siteFunc.renderToTargetPageByType(req,res,'error',{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
    }
});



router.get('/aboutHospital',function (req,res,next){
    siteFunc.renderToTargetPageByType(req,res,'aboutHospital',{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
});

router.get('/newsCenter',function (req,res,next){
    console.log('getting')
    siteFunc.renderToTargetPageByType(req,res,{type:'newsCenter', category: 'Pic_News'},{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
});

router.get('/contentList/:category',function(req,res,next) {
    console.log(req.params,'in router get')
    var category = req.params.category,keyName
    // if (category == 'newsCenter') {
    //     keyName = 'Pic_News'
    // }

    var categoryInfos = {
        type: 'contentList',
        category: category
    }

    console.log(categoryInfos, 'categoryInfos in router get')
    siteFunc.renderToTargetPageByType(req,res,categoryInfos,{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
})

router.get('/contentList/:category/:page',function(req,res,next) {
    console.log(req.params,'in router get')
    var category = req.params.category,keyName,page
    // if (category == 'newsCenter') {
    //     keyName = 'Pic_News'
    // }
    var page = req.params.page ? req.params.page : null

    var categoryInfos = {
        type: 'contentList',
        category: category
    }

    if (page) {
        categoryInfos.page = page
    }

    console.log(categoryInfos, 'categoryInfos in router get')
    siteFunc.renderToTargetPageByType(req,res,categoryInfos,{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
})

router.get('/guides',function(req, res, next) {
    siteFunc.renderToTargetPageByType(req, res, 'guides', {info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
})

router.get('/aboutPatients',function (req,res,next){
    siteFunc.renderToTargetPageByType(req,res,'aboutPatients',{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
});

router.get('/doctors',function (req,res,next){
    siteFunc.renderToTargetPageByType(req,res,'aboutDoctors',{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
});

router.get('/doctors/:department',function (req,res,next){
    siteFunc.renderToTargetPageByType(req,res,'aboutDoctors',{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
});

router.get('/departments',function (req,res,next){
    siteFunc.renderToTargetPageByType(req,res,'aboutDepartments',{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
});

// 科室详情页
// router.get('/department/:id',function (req,res,next){
//     siteFunc.renderToTargetPageByType(req,res,'departmentDetail',{info : '非法操作!',message : settings.system_illegal_param , page : 'do500'});
// });

//获取医生
router.get('/addDoctors',function(req,res,next){
    var skip = req.query.skipNum;
    var type = req.query.cellType;
    var docData = siteFunc.getDoctorList({'departmentType' : type},skip,6);
    res.send(docData);
});

//分类列表页面  http://127.0.0.1/DoraCms___VylIn1IU-1.html
router.get('/:defaultUrl', function (req, res, next) {

    var defaultUrl = req.params.defaultUrl;
    var url = defaultUrl.split('___')[1];
    var indexUrl = defaultUrl.split('—')[0];
    if (indexUrl == 'page') { // 首页的分页
        var indexPage = defaultUrl.split('—')[1].split(".")[0];
        if(indexPage && validator.isNumeric(indexPage)){
            req.query.page = indexPage;
        }
        siteFunc.renderToTargetPageByType(req,res,'index');
    } else {
        var currentUrl = url;
        if (url) {
            if(url.indexOf("—") >= 0){
                currentUrl = url.split("—")[0];
                var catePageNo = (url.split("—")[1]).split(".")[0];
                if(catePageNo && validator.isNumeric(catePageNo)){
                    req.query.page = catePageNo;
                }
            }
            queryCatePage(req, res, currentUrl);
        }else{
            next();
        }
    }

});

//分类列表页面  http://127.0.0.1/front-development/AngluarJs___EyW7kj6w
router.get('/:forder/:defaultUrl', function (req, res, next) {
    var defaultUrl = req.params.defaultUrl;
    var url = defaultUrl.split('___')[1];
    var currentUrl = url;
    if (url) {
        if(url.indexOf("—") >= 0){
            currentUrl = url.split("—")[0];
            var catePageNo = (url.split("—")[1]).split(".")[0];
            if(catePageNo && validator.isNumeric(catePageNo)){
                req.query.page = catePageNo;
            }
        }
        queryCatePage(req, res, currentUrl);
    }else{
        next();
    }
});

router.post('/api/mailtest', function(req, res, next) {

    var mailOptions = {
        from: '13645632112@163.com', // sender address
        to: '641877939@qq.com', // list of receivers
        subject: req.body.title || '测试邮件', // Subject line
        text: req.body.text || 'Nodejs之邮件发送', // plaintext body
        html: req.body.html || "<h2>欢迎关注我的GitHub，一起学习Nodejs。https://github.com/Chen-xy</h2>"
    };

    res.send({
        'status': 1,
        'msg': '邮件已由服务器发送成功'
    });
    siteFunc.sendMailTest(req, res, mailOptions)
})

//分类页面路由设置
function queryCatePage(req, res, cateId) {

    if(shortid.isValid(cateId)){
        ContentCategory.findOne({"_id": cateId}).populate('contentTemp').exec(function(err,result){
            if (err) {
                siteFunc.renderToTargetPageByType(req,res,'error',{info : '页面未找到!',message : err.message, page : 'do500'});
            } else {
                if (result) {
                    var contentQuery = {'sortPath': { $regex: new RegExp(result._id, 'i') },'state' : true};
                    var cateParentId = result.sortPath.split(',')[1];
                    var cateQuery = {'sortPath': { $regex: new RegExp(cateParentId, 'i') }};

                    siteFunc.renderToTargetPageByType(req,res,'contentList',{contentQuery : contentQuery,cateQuery : cateQuery,result : result});
                }
                else {
                    siteFunc.renderToTargetPageByType(req,res,'error',{info : '非法操作!',message : settings.system_illegal_param, page : 'do500'});
                }
            }
        });
    }else{
        siteFunc.renderToTargetPageByType(req,res,'error',{info : '非法操作!',message : settings.system_illegal_param, page : 'do500'});
    }

}

module.exports = router;

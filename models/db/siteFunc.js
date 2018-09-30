/**
 * Created by Administrator on 2015/5/30.
 */
// 文档对象
var Content = require("../Content");
//文章类别对象
var ContentCategory = require("../ContentCategory");
//文章标签对象
var ContentTags = require("../ContentTags");
//文章模板对象
var ContentTemplate = require("../ContentTemplate");
//科室模板对象
var Department = require("../Department");
//医生模板对象
var Doctor = require("../Doctor");
var TemplateItems = require("../TemplateItems");
//广告对象
var Ads = require("../Ads");
//留言对象
var Message = require("../Message");
var settings = require("./settings");

//数据库操作对象
var DbOpt = require("../Dbopt");
//消息对象
var UserNotify = require("../UserNotify");
//时间格式化
var moment = require('moment');
var nodemailer = require('nodemailer');
//缓存
var cache = require('../../util/cache');
//系统消息
var Notify = require("../Notify");
function isLogined(req) {
    return req.session && req.session.logined;
}

var cdnfolder = "http://p9tuyunjh.bkt.clouddn.com"

console.log(nodemailer, 'nodemailer')

var siteFunc = {

    siteInfos: function (title, cmsDescription, keyWords) {
        var discrip;
        var key;

        if (cmsDescription) {
            discrip = cmsDescription;
        } else {
            discrip = settings.CMSDISCRIPTION;
        }

        if (keyWords) {
            key = keyWords + ',' + settings.SITEBASICKEYWORDS;
        } else {
            key = settings.SITEKEYWORDS;
        }

        return {
            title: title + " | " + settings.SITETITLE,
            cmsDescription: discrip,
            keywords: key,
            siteIcp: settings.SITEICP
            //version : settings.SITEVERSION
        }
    },

    setConfirmPassWordEmailTemp : function(name,token){

        var html = '<p>您好：' + name + '</p>' +
            '<p>我们收到您在 <strong>' + settings.SITETITLE + '</strong> 的注册信息，请点击下面的链接来激活帐户：</p>' +
            '<a href="' + settings.SITEDOMAIN + '/users/reset_pass?key=' + token + '">重置密码链接</a>' +
            '<p>若您没有在 <strong>' + settings.SITETITLE + '</strong> 填写过注册信息，说明有人滥用了您的电子邮箱，请忽略或删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
            '<p> <strong>' + settings.SITETITLE + ' </strong> 谨上。</p>';

        return html;

    },

    setNoticeToAdminEmailTemp : function(obj){
        var msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss');
        var html ='';
        html += '主人您好，<strong>'+obj.author.userName+'</strong> 于 '+msgDate +' 在 <strong>' + settings.SITETITLE + '</strong> 的文章 <a href="' + settings.SITEDOMAIN + '/details/'+obj.contentId+'.html">'+obj.contentTitle+'</a> 中留言了';
        return html;
    },

    setNoticeToUserEmailTemp : function(obj){
        msgDate = moment(obj.date).format('YYYY-MM-DD HH:mm:ss');
        var html ='';
        var targetEmail;
        if(obj.author){
            targetEmail = obj.author.userName;
        }else if(obj.adminAuthor){
            targetEmail = obj.adminAuthor.userName;
        }
        html += '主人您好，<strong>'+targetEmail+'</strong> 于 '+msgDate +' 在 <strong>' + settings.SITETITLE + '</strong> 的文章 <a href="' + settings.SITEDOMAIN + '/details/'+obj.contentId+'.html">'+obj.contentTitle+'</a> 中回复了您';
        return html;
    },

    setBugToAdminEmailTemp : function(obj){
        var msgDate = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        var html ='';
        html += '主人您好，测试管理员（'+obj.email+')于 '+msgDate +' 在 <strong>' + settings.SITETITLE + '</strong> 的后台模块 <strong>'+obj.contentFrom+'</strong> 中说：<br>'+obj.content;
        return html;
    },

    setNoticeToUserRegSuccess : function(obj){
        var html ='';
        html += '亲爱的 '+obj.userName+' （'+obj.email+') ，恭喜您成为 <strong>' + settings.SITETITLE + '</strong> 的新用户！ 您现在可以 <a href="'+settings.SITEDOMAIN+'/users/login" target="_blank">点击登录</a>';
        return html;
    },

    getCategoryList: function () {
        return ContentCategory.find({'parentID': '0', 'state': '1'}, 'name defaultUrl').sort({'sortId': 1}).find({});
    },

    //获取文档接口开始

    getHotItemListData: function (q) {
        return Content.find(q, 'stitle').sort({'clickNum': -1}).skip(0).limit(10);
    },

    getHotItemListDataFull: function(q){
        return Content.find(q,'title dateSeted').sort({'dateSeted': -1}).skip(0).limit(10);
    },

    getContentLists: function(q, count) {
        var contents = Content.find( q, 'title description date sImg dateSeted isTop originUrl').sort({'dateSeted': -1}).skip(0).limit(count).exec(function(err,data) {
        });
        return contents
    }, 

    //获取文档接口结束

    getDepartments: function(q){
        return Department.find(q,'department sImg description departmentType').sort('department');
    },

    getTargetDoctors: function(q) {
        return Doctor.find(q,'department description doctor professional sImg sort').sort('department sort');

    },

    getTargetDocuments: function(q) {
        console.log(q, 'getTargetDocuments')
        var contents = Content.find(q,'title stitle dateSeted sImg description from isTop originUrl').sort({'dateSeted': -1}).skip(0).limit(10);;
        console.log(contents)
        return contents

    },

    getDoctorList: function(q,s,l){
        return Doctor.find(q,'doctor department departmentType skillLevel sImg description professional').skip(Number(s)).limit(l);
    },

    getNewItemListData : function(q){
        return Content.find(q, 'title stitle dateSeted sImg description from isTop originUrl clickNum').sort({'date': -1}).skip(0).limit(10);
    },

    getRecommendListData : function(cateQuery,contentCount){
        return Content.find(cateQuery).sort({'date':-1}).skip(Math.floor(contentCount*Math.random())).limit(4);
    },

    getFriendLink: function () {
        return Ads.find({'category': 'friendlink'});
    },

    getMessageList : function(contentId){
        return Message.find({'contentId' : contentId}).sort({'date': 1}).populate('author').populate('replyAuthor').populate('adminAuthor').exec();
    },

    sendSystemNoticeByType : function(req,res,type,value){
        var noticeObj;
        if(type == 'reg'){
            noticeObj = {
                type : '2',
                systemSender : 'doraCMS',
                title : '用户注册提醒',
                content : '新增注册用户 ' + value,
                action : type
            };
        }else if(type == 'msg'){
            noticeObj = {
                type : '2',
                sender : value.author,
                title : '用户留言提醒',
                content : '用户 ' + value.author.userName + ' 给您留言啦！',
                action : type
            };
        }
        Notify.sendSystemNotice(res,noticeObj,function(users,notify){
            UserNotify.addNotifyByUsers(res,users,notify);
        });
    },

    setDataForIndex: function (req, res, params ,staticforder, defaultTempPath) {
        var requireField = 'title date commentNum description clickNum isTop sImg tags originUrl';
        var documentList = DbOpt.getPaginationResult(Content, req, res, params, requireField);
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: this.siteInfos("首页"),
            documentList: documentList.docs,

            hospitalNews: this.getContentLists({'keyName' : 'hospitalNews'},6),
            //notices: this.getContentLists({$or:[{"keyName":"notices"},{"keyName": "hospitalWorks"}]},6),
            notices: this.getContentLists({$or:[{"keyName":"brandNews"},{"keyName": "hospitalWorks"}]},6),
            hospitalCultures: this.getContentLists({'keyName' : 'hospitalCulture'},6),
            expertInfos:this.getContentLists({'tags':new RegExp('专家门诊|专家坐诊')}, 5),

            clinicDeps:this.getDepartments({'departmentType' : '1'}),
            techDeps:this.getDepartments({'departmentType' : '2'}),

            pageType: 'index',
            logined: isLogined(req),
            staticforder : staticforder,
            cdnfolder : cdnfolder,
            layout: defaultTempPath
        }
    },

    setDataForTopicPage: function (req, res, params ,staticforder, defaultTempPath,siteInfo) {
        var requireField = 'title date commentNum description clickNum isTop sImg tags';
        var documentList = DbOpt.getPaginationResult(Content, req, res, params, requireField);
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: this.siteInfos(siteInfo),
            logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForGuidePage: function (req, res, params ,staticforder, defaultTempPath,siteInfo) {
        //var requireField = 'title date commentNum description clickNum isTop sImg tags';
        //var documentList = DbOpt.getPaginationResult(Content, req, res, params, requireField);
        //var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: this.siteInfos(siteInfo),
            //logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForHtmlSiteMap : function(req, res, params ,staticforder, defaultTempPath){

        return {
            siteConfig: siteFunc.siteInfos("网站地图"),
            documentList: params.docs,
            cateTypes: siteFunc.getCategoryList(),
            logined : req.session.logined,
            staticforder : staticforder,
            layout : defaultTempPath
        }

    },

    setDataForCate: function (req, res, params ,staticforder, defaultTempPath) {
        var requireField = 'title date commentNum description clickNum comments isTop sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, params.contentQuery, requireField);
        var currentCateList = ContentCategory.find(params.cateQuery).sort({'sortId': 1});
        var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: this.siteInfos(params.result.name, params.result.comments, params.result.keywords),
            documentList: documentList.docs,
            currentCateList: currentCateList,
            hotItemListData: this.getHotItemListData(params.contentQuery),
            friendLinkData: this.getFriendLink(),
            tagsData: tagsData,
            cateInfo: params.result,
            cateTypes: this.getCategoryList(),
            pageInfo: documentList.pageInfo,
            pageType: 'cate',
            logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForAboutDoctors: function(req, res, params ,staticforder, defaultTempPath) {
        var requireField = 'doctor department departmentType skillLevel sImg description professional';
        return {
            siteConfig: this.siteInfos("医护团队"),
            doctorList: this.getDoctorList({},0),
            clinicDeps:this.getDepartments({'departmentType' : '1'}),
            techDeps:this.getDepartments({'departmentType' : '2'}),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForAboutDepartments: function(req, res, params ,staticforder, defaultTempPath) {
        var requireField = 'department mainDoctor description';
        return {
            siteConfig: this.siteInfos("科室一览"),
            clinicDeps:this.getDepartments({'departmentType' : '1'}),
            techDeps:this.getDepartments({'departmentType' : '2'}),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForNewsCenter:function(req, res, params ,staticforder, defaultTempPath){
        var requireField = 'stitle sImg date description';
        console.log("getting newsCenter")
        return {
            siteConfig:this.siteInfos('新闻中心'),
            picNews: this.getPicNews(6),
            noticeNews: this.getNoticeNews(),
            hospitalWorks: this.getHospitalWorks(),
            hospitalCulture: this.getHospitalCulture(),   
            nursingArea: this.getNursingArea(),
            publicWorks: this.getPublicWorks(),
            staticforder: staticforder,
            layout: defaultTempPath
        }
    },

    setDataForContentList: function (req, res, categoryInfos, params, staticforder, defaultTempPath, pageName) {
        var requireField = 'title date dateSeted state commentNum description clickNum isTop sImg tags originUrl';

        var params = { limit: 9 }
        if (categoryInfos.page) {
            params.page = categoryInfos.page
        }

        var documentList = DbOpt.getPaginationResult(Content, req, res, {'keyName': categoryInfos.category }, requireField, params);

        var categoryDetail = ContentCategory.find({'defaultUrl': categoryInfos.category},'name comments defaultUrl')
        return {
            siteConfig: this.siteInfos(pageName),
            categoryDetail: categoryDetail,
            contentLists: documentList.docs,
            pageInfo: documentList.pageInfo,
            pageType: 'contentList',
            category: categoryInfos.category,
            logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForNewsCenter: function (req, res, categoryInfos, params, staticforder, defaultTempPath) {
        var requireField = 'title date dateSeted state commentNum description clickNum isTop sImg tags';

        var params = { limit: 9 }
        if (categoryInfos.page) {
            params.page = categoryInfos.page
        }

        var documentList = DbOpt.getPaginationResult(Content, req, res, {'keyName': categoryInfos.category }, requireField, params);
        //var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: this.siteInfos("首页"),
            contentLists: documentList.docs,
            hotItemListData: this.getHotItemListData({}),
            hotItemListDataFull: this.getHotItemListDataFull({}),
            pageInfo: documentList.pageInfo,
            picNews: this.getPicNews(5),
            noticeNews: this.getNoticeNews(),
            departments:this.getDepartments(),
            doctorList:this.getDoctorList({'departmentType' : 3},0,6),
            pageType: 'contentList',
            category: categoryInfos.category,
            logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    // 医生列表页数据
    setDataForDoctorList: function (req, res, params ,staticforder, defaultTempPath) {

        console.log(req.params, 'req')
        var department = req.params.department || '中医科'

        var doctors = this.getTargetDoctors({'department': department})

        var docsData = DbOpt.getDatasByParam(Doctor, req, res, {});


        return {
            siteConfig: this.siteInfos('医生介绍', '介绍各专业科室', '内科、外科、妇产科、儿科'),
            //cateTypes: this.getCategoryList(),
            //reCommendListData : this.getRecommendListData(params.cateQuery,params.count),
            doctors: doctors,
            department: department,
            clinicDeps:this.getDepartments({'departmentType' : '1'}),
            techDeps:this.getDepartments({'departmentType' : '2'}),
            //articles: this.getTargetDocuments(params.department.department),
            pageType: 'doctorList',
            //logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDetailInfo: function (req, res, params ,staticforder, defaultTempPath) {
        console.log(params.cateQuery, 'cateQuery')
        var currentCateList = ContentCategory.find({}).sort({'sortId': 1});
        //var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        return {
            siteConfig: this.siteInfos(params.detail.title, params.detail.description, params.detail.keywords),
            cateTypes: this.getCategoryList(),
            currentCateList: currentCateList,
            hotItemListData: this.getHotItemListData({}),
            newItemListData: this.getNewItemListData({}),
            friendLinkData: this.getFriendLink(),
            reCommendListData : this.getRecommendListData(params.cateQuery,params.count),
            documentInfo: params.detail,
            messageList : this.getMessageList(params.detail._id),
            pageType: 'detail',
            //logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    // 科室详情页数据
    setDepartmentInfo: function (req, res, params ,staticforder, defaultTempPath) {
        console.log(params.cateQuery, 'cateQuery')
        //var currentCateList = ContentCategory.find({}).sort({'sortId': 1});
        //var tagsData = DbOpt.getDatasByParam(ContentTags, req, res, {});
        console.log(params)
        return {
            siteConfig: this.siteInfos('科室介绍——'+params.department.department, params.department.description, params.department.subjects),
            //cateTypes: this.getCategoryList(),
            //reCommendListData : this.getRecommendListData(params.cateQuery,params.count),
            departmentInfo: params.department,
            //messageList : this.getMessageList(params.department._id),
            doctors: this.getTargetDoctors({'department': new RegExp(params.department.department)}),
            articles: this.getTargetDocuments({'tags': new RegExp(params.department.department)}),
            pageType: 'department',
            //logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForSearch: function (req, res, params, staticforder, defaultTempPath) {
        req.query.searchKey = params.searchKey;
        var requireField = 'title date commentNum description clickNum sImg';
        var documentList = DbOpt.getPaginationResult(Content, req, res, params.query, requireField);
        return {
            siteConfig: this.siteInfos("文档搜索"),
            documentList: documentList.docs,
            cateTypes: this.getCategoryList(),
            cateInfo: '',
            pageInfo: documentList.pageInfo,
            pageType: 'search',
            logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForError: function (req, res, params , staticforder, defaultTempPath) {
        return {
            siteConfig: this.siteInfos(params.info),
            cateTypes: this.getCategoryList(),
            errInfo: params.message,
            pageType: 'error',
            logined: isLogined(req),
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForUser: function (req, res, params, staticforder, defaultTempPath) {
        return {
            siteConfig: this.siteInfos(params.title),
            cateTypes: this.getCategoryList(),
            userInfo: req.session.user,
            tokenId : params.tokenId,
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForUserReply: function (req, res, params, staticforder, defaultTempPath) {
        req.query.limit = 5;
        var documentList = DbOpt.getPaginationResult(Message, req, res, {'author' :  req.session.user._id});
        return {
            siteConfig: this.siteInfos(params.title),
            cateTypes: this.getCategoryList(),
            userInfo: req.session.user,
            replyList : documentList.docs,
            pageInfo: documentList.pageInfo,
            pageType: 'replies',
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForUserNotice: function (req, res, params, staticforder, defaultTempPath) {
        req.query.limit = 10;
        var documentList = UserNotify.getNotifyPaginationResult(req, res, req.session.user._id);
        return {
            siteConfig: this.siteInfos(params.title),
            cateTypes: this.getCategoryList(),
            userInfo: req.session.user,
            userNotifyListData : documentList.docs,
            pageInfo: documentList.pageInfo,
            pageType: 'notifies',
            staticforder : staticforder,
            layout: defaultTempPath
        }
    },

    setDataForInfo : function(params, staticforder, defaultTempPath){

        return {
            siteConfig: this.siteInfos('操作提示'),
            cateTypes: this.getCategoryList(),
            infoType : params.key,
            infoContent : params.value,
            staticforder : staticforder,
            layout: defaultTempPath
        }

    },

    setDataForSiteMap: function (req, res) {

        var root_path = settings.SITEDOMAIN;
        var priority = 0.8;
        var freq = 'weekly';
        var lastMod = moment().format('YYYY-MM-DD');
        var xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        xml += '<url>';
        xml += '<loc>' + root_path + '</loc>';
        xml += '<changefreq>daily</changefreq>';
        xml += '<lastmod>' + lastMod + '</lastmod>';
        xml += '<priority>' + 1 + '</priority>';
        xml += '</url>';
        cache.get(settings.session_secret + '_sitemap', function(siteMapData){
            if(siteMapData){ // 缓存已建立
                res.end(siteMapData);
            }else{
                ContentCategory.find({}, 'defaultUrl', function (err, cates) {
                    if (err) {
                        console.log(err);
                    } else {
                        cates.forEach(function (cate) {
                            xml += '<url>';
                            xml += '<loc>' + root_path + '/' +cate.defaultUrl + '___' + cate._id + '</loc>';
                            xml += '<changefreq>weekly</changefreq>';
                            xml += '<lastmod>' + lastMod + '</lastmod>';
                            xml += '<priority>0.8</priority>';
                            xml += '</url>';
                        });

                        Content.find({}, 'title', function (err, contentLists) {
                            if (err) {
                                console.log(err);
                            } else {
                                contentLists.forEach(function (post) {
                                    xml += '<url>';
                                    xml += '<loc>' + root_path + '/details/' + post._id + '.html</loc>';
                                    xml += '<changefreq>weekly</changefreq>';
                                    xml += '<lastmod>' + lastMod + '</lastmod>';
                                    xml += '<priority>0.5</priority>';
                                    xml += '</url>';
                                });
                                xml += '</urlset>';
                                // 缓存一天
                                cache.set(settings.session_secret + '_sitemap', xml, 1000 * 60 * 60 * 24);
                                res.end(xml);
                            }
                        })
                    }

                })
            }
        })

    },
    //缓存文章总数，避免多次查询
    getContentsCount : function(req,res,cateParentId,cateQuery,callBack){
        cache.get(settings.session_secret + '_' + cateParentId + '_contentCount',function(contentCount){
            if(contentCount) {
                callBack(contentCount);
            }else{
                Content.count(cateQuery,function(err,count){
                    if(err){
                        res.end(err);
                    }else{
                        cache.set(settings.session_secret +  '_' + cateParentId + '_contentCount', count, 1000 * 60 * 60 * 24); // 缓存一天
                        callBack(count)
                    }
                })
            }
        });
    },

    //缓存科室总数，避免多次查询
    getContentsCount : function(req,res,cateParentId,cateQuery,callBack){
        cache.get(settings.session_secret + '_' + cateParentId + '_contentCount',function(contentCount){
            if(contentCount) {
                callBack(contentCount);
            }else{
                Content.count(cateQuery,function(err,count){
                    if(err){
                        res.end(err);
                    }else{
                        cache.set(settings.session_secret +  '_' + cateParentId + '_contentCount', count, 1000 * 60 * 60 * 24); // 缓存一天
                        callBack(count)
                    }
                })
            }
        });
    },

    //根据id获取模板单元的forder
    getTempItemById : function(defatulTemp,id){
        var targetForder = '';
        var targetTemps = defatulTemp.items;
        for(var i=0;i<targetTemps.length;i++){
            var temp = targetTemps[i];
            if(temp && temp._id == id){
                targetForder = temp.forder;
                break;
            }
        }
        return targetForder;
    },

    //获取默认模板中的默认模板单元
    getDefaultTempItem : function(temp){

        var defaultTempForder = '';
        if(temp){
            var targetTemps = temp.items;
            for(var i=0;i<targetTemps.length;i++){
                var temp = targetTemps[i];
                if(temp && temp.isDefault){
                    defaultTempForder = temp.forder;
                    break;
                }
            }
        }
        return defaultTempForder;

    },
    //缓存前台模板
    getFrontTemplate : function(req,res,callBack){

        cache.get(settings.session_secret + '_siteTemplate',function(siteTemplate){
            if(siteTemplate) {

                callBack(siteTemplate);

            }else{

                ContentTemplate.getDefaultTemp(function(doc){
                    if(doc){
                        cache.set(settings.session_secret + '_siteTemplate', doc , 1000 * 60 * 60 * 24); // 缓存一天
                    }
                    callBack(doc);
                });

            }
        });

    },

    sendMailTest: function (req, res, options) {
        //var mail = req.body.mailaddress;
        //检测邮箱地址是否为空
        // if (!mail) {
        //     return res.render("index", {message: "请输入邮箱地址！"});
        // }
        // //检测邮箱地址是否符合规范
        // var reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$/;
        // if (!mail.match(reg)) {
        //     return res.render("index", {message: "邮箱地址不符合规范，请重新输入！"});
        // }
        //邮件发送
        var transporter = nodemailer.createTransport({
            service: '163',
            auth: {
                user: '13645632112',//你的163邮箱账号
                pass: 'xxk1062'//你的163邮箱密码
            }
        });
        console.log(options,'options')

        transporter.sendMail(options, function(error, info){

            if(!error){
                //return res.render("index", {message: "邮件发送成功，请注意查收！"});
                // res.status(200),
                // res.json({
                //     status: 1,
                //     msg: '邮件发送成功',
                //     data: req
                // })
                console.log(info, 'success');
            }else{
                console.log(error);
                // res.status(200),
                // res.json({
                //     status: 0,
                //     msg: '邮件发送失败，请稍后再试'
                // })
                //return res.render("index", {message: "邮件发送失败，请稍后重试！"});
            }

        });
    },

    //根据模板获取跳转链接
    renderToTargetPageByType : function(req,res,categoryInfos,params){
        var oType = categoryInfos.type || categoryInfos
        console.log(categoryInfos, oType, 'renderToTargetPageByType')
        this.getFrontTemplate(req,res,function(temp) {
            var targetPath;
            if (temp) {
                var defaultTempPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/defaultTemp';
                var topicTempPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/topicTemp';
                if(oType == 'index'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/index';
                    res.render(targetPath , siteFunc.setDataForIndex(req, res, {'oType': 'content','state' : true} , temp.alias, defaultTempPath));
                }else if(oType == 'sitemap'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/sitemap';
                    res.render(targetPath , siteFunc.setDataForHtmlSiteMap(req, res, params , temp.alias, defaultTempPath));
                }else if(oType == 'contentList1'){
                    if(params.result.contentTemp){
                        targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/' + params.result.contentTemp.forder + '/contentList';
                    }else{
                        targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/' + siteFunc.getDefaultTempItem(temp) + '/contentList';
                    }
                    res.render(targetPath, siteFunc.setDataForCate(req, res, params, temp.alias, topicTempPath));
                }else if(oType == 'detail'){
                    if(params.detail.category.contentTemp){
                        var targetForder = siteFunc.getTempItemById(temp,params.detail.category.contentTemp);
                        targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/' + targetForder + '/detail';
                    }else{
                        targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/' + siteFunc.getDefaultTempItem(temp) + '/detail';
                    }
                    res.render(targetPath , siteFunc.setDetailInfo(req, res, params , temp.alias, topicTempPath));
                }else if(oType == 'departmentDetail'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/departmentDetail';
                    res.render(targetPath , siteFunc.setDepartmentInfo(req, res, params , temp.alias, defaultTempPath));
                }else if(oType == 'user'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/' + params.page;
                    res.render(targetPath, siteFunc.setDataForUser(req, res, params , temp.alias, defaultTempPath));
                }else if(oType == 'userNotice'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/' + params.page;
                    res.render(targetPath, siteFunc.setDataForUserNotice(req, res, params, temp.alias, defaultTempPath));
                }else if(oType == 'userInfo'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/' + params.page;
                    res.render(targetPath, siteFunc.setDataForInfo(params, temp.alias, defaultTempPath));
                }else if(oType == 'userReply'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/users/' + params.page;
                    res.render(targetPath, siteFunc.setDataForUserReply(req, res, params, temp.alias, defaultTempPath));
                }else if(oType == 'search'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/' + params.page;
                    res.render(targetPath, siteFunc.setDataForSearch(req, res, params, temp.alias, defaultTempPath));
                }else if(oType == 'error'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/' + params.page;
                    res.render(targetPath, siteFunc.setDataForError(req, res,  params, temp.alias, defaultTempPath));
                }else if(oType == 'aboutHospital'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/aboutHospital';
                    res.render(targetPath, siteFunc.setDataForTopicPage(req, res,  params, temp.alias, topicTempPath,'医院概况'));
                }else if(oType == 'aboutPatients'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/aboutPatients';
                    res.render(targetPath, siteFunc.setDataForTopicPage(req, res,  params, temp.alias, topicTempPath,'患者服务'));
                }else if(oType == 'guides'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/guides';
                    res.render(targetPath, siteFunc.setDataForGuidePage(req, res,  params, temp.alias, defaultTempPath,'患者服务'));
                }else if(oType == 'aboutDoctors'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/aboutDoctors';
                    res.render(targetPath, siteFunc.setDataForDoctorList(req, res,  params, temp.alias, defaultTempPath,'医护团队'));
                }else if(oType == 'aboutDepartments'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/aboutDepartments';
                    res.render(targetPath, siteFunc.setDataForAboutDepartments(req, res,  params, temp.alias, topicTempPath,'科室一览'));
                }else if(oType == 'contentList'){
                    targetPath = settings.SYSTEMTEMPFORDER + temp.alias + '/public/contentTemps/newsCenter';
                    res.render(targetPath, siteFunc.setDataForContentList(req, res, categoryInfos, params, temp.alias, topicTempPath,settings.NEWSCENTER[categoryInfos.category]));
                }

            }else{
                res.writeHeader(200, {'Content-Type':'text/javascript;charset=UTF-8'});
                res.end('亲爱哒，请先在后台安装并启用模板喔~!');
            }
        })

    }

};
module.exports = siteFunc;

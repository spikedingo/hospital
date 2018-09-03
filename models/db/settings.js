/**
 * Created by dora on 2015/4/8.
 * 创建数据库连接
 * 该模块只会被加载一次
 */

module.exports = {

    // debug 为 true 时，用于本地调试
    debug: false,
    imgZip : false, // 上传图片是否压缩(如果为false则本地不需要安装gm)
    session_secret: 'doracms_secret', // 务必修改
    auth_cookie_name: 'doracms',
    encrypt_key : 'dora',
//    数据库配置
    URL: 'mongodb://127.0.0.1:27017/doracms',
    DB: 'doracms',
    HOST: '127.0.0.1',
    PORT: 27017,
    USERNAME: 'jdxyy',
    PASSWORD: 'xxk1062',


//    站点基础信息配置
    SITETITLE : '旌德县人民医院', // 站点名称
    SITEDOMAIN : 'http://www.ahjdyy.com', // 站点域名
    SITEICP : '皖ICP备09022350号-2', // 站点备案号
    SITEVERSION : '', // 静态资源版本戳
    SYSTEMMAIL : '641877939@qq.com', // 管理员个人邮箱
    UPDATEFOLDER : process.cwd()+'/public/upload', // 默认上传文件夹本地路径
    TEMPSTATICFOLDER : process.cwd()+'/public/themes/', // 模板静态文件路径
    DATAOPERATION : process.cwd()+'/models/db/bat', //数据库操作脚本目录
    DATABACKFORDER : 'C:/softbak/mongodbConfig/mongodata/', // 服务端数据备份目录
    MONGODBEVNPATH : '/usr/local/mongodb/bin', // LINUXmongodb环境变量(win server下不用管)
    SYSTEMTEMPFORDER : process.cwd()+'/views/web/temp/', // 系统模板安装目录
    DORACMSAPI : 'http://api.html-js.cn', // 系统服务提供商
    CMSDISCRIPTION : '旌德县人民医院,展示医院风貌,全面推进医院信息化建设',
    SITEKEYWORDS : '旌德县人民医院,展示医院风貌,二级甲等综合医院,医院,治疗,看病,综合医院,中医,信息化医院,信息化,核磁共振,国医堂',
    SITEBASICKEYWORDS : '旌德县人民医院,二级甲等综合医院,医院官网', // 基础关键词


    SYSTEMMANAGE : new Array('sysTemManage','DoraCMS后台管理'),  // 后台模块(系统管理)
    ADMINUSERLIST : new Array('sysTemManage_user','系统用户管理'),
    ADMINGROUPLIST : new Array('sysTemManage_uGroup','系统用户组管理'),
    ADSLIST : new Array('sysTemManage_ads','广告管理'),
    FILESLIST : new Array('sysTemManage_files','文件管理'),
    DATAMANAGE : new Array('sysTemManage_data','数据管理'), // 数据管理
    BACKUPDATA : new Array('sysTemManage_data_1','数据备份'), // 数据备份
    SYSTEMLOGS : new Array('sysTemManage_logs','操作日志'), // 系统操作日志


    CONTENTMANAGE : new Array('contentManage','内容管理'), // 后台模块(内容管理)
    CONTENTLIST : new Array('contentManage_content','文档管理'),
    TOPICCONTENTLIST : new Array('contentManage_topicContent','专栏管理'),
    PUBLICCONTENTLIST : new Array('contentManage_publicContent','党建管理'),
    NOTICESLIST : new Array('contentManage_notices','通知管理'),
    CONTENTCATEGORYS : new Array('contentManage_cateGory','文档类别管理'),
    DEPARTMENTLIST: new Array('contentManage_department','科室管理'),  //科室管理
    DOCTORLIST: new Array('contentManage_doctor','医生管理'),  //医生管理
    CONTENTTAGS : new Array('contentManage_tag','文档标签管理'), //标签管理
    CONTENTTEMPS : new Array('contentManage_temp','文档模板管理'), //模板管理
    CONTENTTEMPSCONFIG : new Array('contentManage_temp_1','模板配置'), //模板管理
    CONTENTTEMPSEDIT : new Array('contentManage_temp_2','模板编辑'), //模板管理
    CONTENTTEMPITEMS : new Array('contentManage_tpItem','文档模板单元管理'), //模板单元管理
    MESSAGEMANAGE : new Array('contentManage_msg','留言管理'), // 留言管理
    NOTICEMANAGE : new Array('contentManage_notice','消息管理'), // 消息管理
    SYSTEMNOTICE : new Array('contentManage_notice_1','公告管理'), // 公告管理
    USERNOTICE : new Array('contentManage_notice_2','用户消息'), // 用户消息
    SYSTEMBACKSTAGENOTICE : new Array('contentManage_notice_3','系统消息'), // 系统消息

    USERMANAGE : new Array('userManage','会员管理'), // 后台模块(会员管理)
    REGUSERSLIST: new Array('userManage_user','注册用户管理'),

//    本地缓存设置
    redis_host: '127.0.0.1',
    redis_port: 6379,
    redis_psd : '',
    redis_db: 0,

//    邮件相关设置
    site_email : 'xx@163.com',
    site_email_psd : 'xxx',
    email_findPsd : 'findPsd',
    email_reg_active : 'reg_active',
    email_notice_contentMsg : 'notice_contentMsg',
    email_notice_contentBug : 'notice_contentBug',
    email_notice_user_contentMsg : 'notice_user_contentMsg',
    email_notice_user_reg : 'notice_user_reg',


//    信息提示相关
    system_illegal_param : '非法参数',

    NEWSCENTER: {
        'allNews': '所有文章',
        'brandNews': '重大新闻',
        'hospitalNews': '医院动态',
        'hospitalWorks': '院务公开',
        'nursingArea': '护理园地',
        'hospitalCulture': '医院文化',
        'videoNews': '视频新闻',
        'notices': '医院公告',
        'healthTips': '健康科普',
        'publicWorks': '党建工作'
    }
};




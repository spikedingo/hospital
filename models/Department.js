/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shortid = require('shortid');
var ContentCategory = require('./ContentCategory');
var AdminUser = require('./AdminUser');
var DepartmentSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    department:  String,
    tags : String, // 标签
    keywords : String,
    sImg : { type: String, default: "/upload/images/defaultImg.jpg" }, // 文章小图
    description : String,
    mainDoctor : String,
    updateDate: { type: Date, default: Date.now } // 更新时间
});

var Department = mongoose.model("Department",DepartmentSchema);

module.exports = Department;


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
    departmentType: {type: String, default: '1'}, // 
    subDepartments: String,
    subjects: String,
    sImg : { type: String, default: "/upload/images/defaultImg.jpg" }, // 文章小图
    keywords : String,
    description : String, // 科室类型，1 临床 2 医技
    updateDate: { type: Date, default: Date.now } // 更新时间
});

var Department = mongoose.model("Department",DepartmentSchema);

module.exports = Department;


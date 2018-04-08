/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shortid = require('shortid');
var AdminUser = require('./AdminUser');
var DoctorSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    doctor:  String,
    keywords : String,
    department: String,
    departmentType: Number,
    sImg : { type: String, default: "/upload/images/defaultImg.jpg" }, // 文章小图
    professional : String,
    skillLevel: String,
    discription : String,
    updateDate: { type: Date, default: Date.now } // 更新时间
});

var Doctor = mongoose.model("Doctor",DoctorSchema);

module.exports = Doctor;

